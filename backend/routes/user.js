const express = require("express");
const route = express.Router();

const { authMiddleware } = require("../middleware");

const zod = require("zod");
const { User, Account } = require("../db");
const jwt = require("jsonwebtoken");
// const { JWT_SECRET } = require("../config");

//signUp
const signupSchema = zod.object({
  username: zod.string().email(),
  password: zod.string(),
  firstname: zod.string(),
  lastname: zod.string(),
});

route.post("/signup", async (req, res) => {
  const { success } = signupSchema.safeParse(req.body);

  if (!success) {
    return res.status(411).json({
      message: "Email already taken/invalid Inputs",
    });
  }

  const existingUser = await User.findOne({
    username: req.body.username,
  });

  if (existingUser) {
    return res.status(411).json({
      msg: "User already taken!",
    });
  }

  const user = await User.create({
    username: req.body.username,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  });
  const userId = user._id;

  await Account.create({
    userId,
    balance: 1 + Math.random() * 100000,
  });

  const token = jwt.sign(
    {
      userId,
    },
    "vasanth_kumar"
  );

  return res.json({
    message: "User Created Succesfully",
    token: token,
  });
});

//signIn
const signinBody = zod.object({
  username: zod.string().email(),
  password: zod.string(),
});
route.post("/signin", async (req, res) => {
  const { success } = signinBody.safeParse(req.body);
  if (!success) {
    return req.status(404).json({
      message: "Incorrect inputs",
    });
  }
  const user = await User.findOne({
    username: req.body.username,
    password: req.body.password,
  });

  if (user) {
    const token = jwt.sign(
      {
        userId: user._id,
      },
      "vasanth_kumar"
    );

    res.json({
      token: token,
    });
    return;
  }
  return res.status(411).json({
    msg: "Error While logging in!",
  });
});

//Update Credentials
const updateBody = zod.object({
  username: zod.string().optional(),
  firstName: zod.string().optional(),
  lastname: zod.string().optional(),
});
route.put("/", authMiddleware, async (req, res) => {
  const { success } = updateBody.safeParse(req.body);

  if (!success) {
    return res.status(411).json({
      message: "Error while updating information",
    });
  }

  await User.updateOne({ _id: req.userId }, req.body);

  res.json({
    msg: "Updated Succesfully!",
  });
});

//for getting user from the backend through filtarable via firstname/lastname.
route.get("/bulk", async (req, res) => {
  // Extracting the "filter" query parameter from the request URL, defaulting to an Empty string if not provided
  const filter = req.query.filter || "";

  //Using the Mongoose 'find' method to query the 'User' collection
  const users = await User.find({
    //Using $ or operator to specify the multiple collection
    $or: [
      {
        // searching for "firstName" that matches the regrex pattern provided in "filter".
        firstName: {
          $regrex: filter,
        },
      },
      {
        lastName: {
          $regrex: filter,
        },
      },
    ],
  });

  //Sending a JSON response back to the client
  res.json({
    user: users.map((user) => ({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      _id: user._id,
    })),
  });
});

module.exports = route;
