const User = require('../models/user')
const utils = require('../services/utils')
const userClass = require('../classes/userClass')
const userEmails = require('../emailsTemplate/userEmails')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.addNewContact = (email, userId, activeCommunity) => {
    let password = utils.randomValueGenerator()
    console.log("Ganaretd password : ", password);

    return new Promise((resolve, reject) => {
        userClass.userClassAddNew(password, email, activeCommunity)
            .then(user => {
                userClass.saveUser(user, email, password, userId)
                    .then(email => {
                        resolve(email)
                    })
            })
    })
}

exports.addExistingContactToCommunity = (email, existingUser, senderId, activeCommunity) => {

    return new Promise((resolve, reject) => {
        userClass.userAddNewCommnity(email, existingUser, senderId, activeCommunity)
            .then(email => resolve(email))
    })
}

exports.checkIfCommunityExist = (email, activeCommunity) => {

    return new Promise((resolve, reject) => {
        User.find({
                "credentials.email": email,
                "profile.profileCummunityId": activeCommunity
            }).exec()
            .then(usr => {
                resolve(usr.length)
            })
    })
}

exports.emailExist = (email, userId, activeCommunity) => {

    return new Promise((resolve, reject) => {
        User.find({
                "credentials.email": email.value
            }).exec()
            .then(usr => {
                if (usr.length === 0) {
                    this.addNewContact(email.value, userId, activeCommunity)
                        .then(email => resolve(email))
                } else {
                    this.checkIfCommunityExist(email.value, activeCommunity)
                        .then(results => {
                            if (results === 1) {
                                let newEmail = {
                                    value: email.value,
                                    status: 500
                                }
                                resolve(newEmail)
                            } else if (results === 0) {
                                this.addExistingContactToCommunity(email.value, usr, userId, activeCommunity)
                                    .then(email => {
                                        resolve(email)
                                    })
                            }
                        })
                }
            })
    })
}


// This is the main function 
exports.addContacts = (emails, userId, activeCommunity) => {
    let emailsList = [];

    return new Promise((resolve, reject) => {
        emails.map(email => {
            this.emailExist(email, userId, activeCommunity)
                .then(response => {
                    emailsList.push(response)
                    if (emails.length === emailsList.length)
                        resolve(emailsList)
                })
        })

    })
}

exports.getImagePath = (req, imageBody) => {
    let imagePath;

    if (imageBody != undefined)
        imagePath = req.body.communityLogo;
    else if (req.files == undefined)
        imagePath = "uploads/defaultEventImage.jpeg"
    else if (req.files != undefined)
        imagePath = req.files[0].path;

    return imagePath
}

checkIfEmailExist = (email) => {

    console.log("Enail : ", email)
    return new Promise((resolve, reject) => {
        User.find({
                "credentials.email": email
            }).exec()
            .then(usr => {
                console.log("User: ", usr)
                if (usr.length === 0)
                    resolve(true)
                else
                    resolve(false)
            }).catch(err => utils.defaultError(res, err))

    })
}

createNewAccount = (value, res) => {
    userClass.creatNewAccountUser(value)
        .then(usr => {
            let user = new User(usr)
            console.log("Use : ", user)
            user.save()
                .then(result => {
                    let msg = userEmails.accountFirstCreation(value.email, value.password);
                    utils.sendEmail("Habee TEAM", value.email, "Confirmationi de creation de compte", msg);
                    res.status(200).json({
                        code: 200,
                        msg: "Accountcreated with success"
                    })
                })
                .catch(err => {
                    utils.defaultError(res, err)
                });
        })
}

checkPassword = (req, res, users) => {
    if (bcrypt.compareSync(req.body.credentials.password, users[0].credentials.password) == true) {
        const token = jwt.sign({
            id: req.body.userId,
            email: req.body.credentials.email
        }, process.env.JWT_KEY, {
            expiresIn: process.env.TOKEN_DURATION
        })
        res.status(200).json({
            message: "Auth success",
            code: "200",
            userId: users[0].userId,
            activeCommunity: users[0].activeCommunity,
            firstConnection: users[0].firstConnection,
            token: token
        })
    } else {
        res.status(200).json({
            message: "Auth failed",
            code: "409",
        })
    }
}

loginUser = (req, res) => {
    User.find({
            "credentials.email": req.body.credentials.email
        })
        .exec()
        .then(users => {
            if (users.length === 0) {
                return res.status(200).json({
                    message: "Auth failed",
                    code: "404"
                })
            } else
                checkPassword(req, res, users);
        })
        .catch(err => utils.defaultError(res, err))
}

updateFirstConnection = (req, res) => {
    let userId = req.params.userId;
    User.find({
            userId: userId
        })
        .exec()
        .then(usr => {
            req.body.firstConnection = usr[0].firstConnection + 1;
            User.findByIdAndUpdate(usr[0]._id,
                req.body, {
                    new: false,
                },
                function (err, results) {
                    if (err) return res.status(500).json(err);
                    res.status(200).json({
                        results: true
                    })
                });
        })
        .catch(err => utils.defaultError(res, err))
}

module.exports = {
    updateFirstConnection,
    checkPassword,
    checkIfEmailExist,
    createNewAccount,
    loginUser
}