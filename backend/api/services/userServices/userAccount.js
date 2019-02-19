const User = require('../../models/user')
const Community = require('../../models/community')
const Event = require('../../models/event')
const utils = require('../utils')
const bcrypt = require('bcrypt');


getThisAccountInfo = (res, userId) => {
    User.find({
        userId: userId
    }).select("credentials")
    .exec()
    .then(usr => {
        res.status(200).json({
            code: 200,
            User: {
                firstname: usr[0].credentials.firstname,
                lastname: usr[0].credentials.lastname,
                address: usr[0].credentials.address,
                email: usr[0].credentials.email,
                phone: usr[0].credentials.phone
            }
        })
    })
}


module.exports = {
    getThisAccountInfo
}