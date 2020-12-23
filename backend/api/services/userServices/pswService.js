const User = require('../../models/user')
const Community = require('../../models/community')
const Event = require('../../models/event')
const utils = require('../utils')
const bcrypt = require('bcrypt');

verfiyPsw = (res, psw, userId) => {
    User.find({
        userId: userId
    }).exec()
    .then(usr => {
        if (bcrypt.compareSync(psw, usr[0].credentials.password) == true) {
            res.status(200).json({
                code: 200,
                msg: "good Password"
            })
        } else {
            res.status(200).json({
                code: 301,
                msg: "Bad password"
            })
        }
    }).catch(err => utils.defaultError(res, err))
}

updateThisUser = (res, user) => {
    User.findByIdAndUpdate(user[0]._id,
        user[0], {
            new: false,
        },
        function (err, results) {
            if (err) return res.status(200).json({
                code: 500,
                msg: "An error occured"
            });
            res.status(200).json({
                code: 200,
                msg: "Password updated with success !"
            })
        }); 
}


updateThisPsw = (res, psw, userId) => {
    User.find({
        userId: userId
    }).exec()
    .then(usr => {
        bcrypt.hash(psw, 10, (err, hash) => {
           usr[0].credentials.password = hash;
            updateThisUser(res, usr)  
        })
    }).catch(err => utils.defaultError(res, err))
}

module.exports = {
    verfiyPsw,
    updateThisPsw,
    updateThisUser
}