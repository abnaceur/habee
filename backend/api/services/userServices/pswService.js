const User = require('../../models/user')
const Community = require('../../models/community')
const Event = require('../../models/event')
const utils = require('../utils')

verfiyPsw = (res, psw, userId) => {
    console.log("Password :", psw, userId)
}


module.exports = {
    verfiyPsw
}