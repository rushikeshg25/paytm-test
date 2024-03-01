const express = require("express");
const {authMiddleware} = require("../middleware");
const {Account} = require('../db');
const { default: mongoose } = require("mongoose");
const route = express.Router();


route.get('/balance',authMiddleware,async (req,res)=>{
    const account = await Account.findOne({
        userId: req.userId,
    })
    res.json({
        balance: account.balance
    })
});

route.post('/transfer',authMiddleware,async (req,res)=>{
    const session = await mongoose.startSession();
    
    session.startTransaction();
    const { amount,to } = req.body;

    const account = await Account.findOne({ userId: req.userId }).session(session);

    if (!account || account.balance<amount) {
        await session.abortTransaction();
        return res.status(400).json({
            msg: "Insufficient Balance."
        })
    }

    const toAccount = await Account.findOne({ userId: to }).session(session);

    if (!toAccount){
        await session.abortTransaction();
        return res.status(411).json({
            msg: "Invalid Account!"
        })
    }

    //Perform the transfer
    await Account.updateOne({ userId: res.userId },{ $inc: { balance: -amount } }).session(session);
    await Account.updateOne({ userId: to },{ $inc: { balance: amount } }).session(session);

    //Commit the transaction
    await session.commitTransaction();

    return res.json({
        msg: "Transfer Succesful!"
    });
});

module.exports = route;