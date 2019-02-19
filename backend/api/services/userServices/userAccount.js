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
    }).catch(err => utils.defaultError(res, err));
}

updatUser = (user, res) => {
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

editUser = (usr, data, res) => {
    usr[0].credentials.firstname = data.firstName;
    usr[0].credentials.lastname = data.lastName;
    usr[0].credentials.address = data.address;
    usr[0].credentials.email = data.email;
    usr[0].credentials.phone = data.phoneNumber;
    
    updatUser(usr, res)
}


updateThisUserAccount = (res, data, userId) => {
    User.find({
        userId: userId
    })
    .exec()
    .then(usr => {
        editUser(usr, data, res)
    }).catch(err => utils.defaultError(res, err));
}


module.exports = {
    updatUser,
    getThisAccountInfo,
    updateThisUserAccount
}