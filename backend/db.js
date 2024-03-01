
// const mongoose = require("mongoose")

// mongoose.connect("mongodb://vasanth24ias:ZeLfuxzhAXkvVKG5@ac-sd0kvcd-shard-00-00.afpnqmj.mongodb.net:27017,ac-sd0kvcd-shard-00-01.afpnqmj.mongodb.net:27017,ac-sd0kvcd-shard-00-02.afpnqmj.mongodb.net:27017/?replicaSet=atlas-14jgl6-shard-0&ssl=true&authSource=admin")

// //Create a Schema for Users
// const UserTable = new mongoose.Schema({
//     username: String,
//     password: String,
//     firstName: String,
//     secondName: String
// })

// //create a mongoose model 
// const User = mongoose.model("User",UserTable);

// model.exports = {
//     User
// }


const mongoose = require("mongoose")

mongoose.connect("mongodb://vasanth24ias:ZeLfuxzhAXkvVKG5@ac-sd0kvcd-shard-00-00.afpnqmj.mongodb.net:27017,ac-sd0kvcd-shard-00-01.afpnqmj.mongodb.net:27017,ac-sd0kvcd-shard-00-02.afpnqmj.mongodb.net:27017/?replicaSet=atlas-14jgl6-shard-0&ssl=true&authSource=admin")

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minlength: 6,
        maxlength: 30
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50,
    }
})

const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    balance: {
        type: Number,
        required: true
    }
})
const User = mongoose.model("User",UserSchema)
const Account = mongoose.model("Account",accountSchema);
module.exports = {
    User,
    Account
}


