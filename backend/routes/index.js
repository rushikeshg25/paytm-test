const express = require("express");
const userRouter = require('./user');
const accountRouter = require('./account')

const route = express.Router();

route.use('/user',userRouter)
route.use('/account', accountRouter)

module.exports = route;