const User = require('../models/user')
const utils = require('../services/utils')
const userClass = require('../classes/userClass')
const userEmails = require('../emailsTemplate/userEmails')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const communityService = require("../services/communityServices/communityService");
const Invitation = require('../models/invitation');
const invitationClass = require('../classes/invitationClass')
const invitationService = require('./userServices/userInvitationService')
const emailCreation = require('./emailServices/accountCreationEmailservice')

getUserInformation = (userId, activeCommunity) => {
    return new Promise((resolve, reject) => {
        User.find({
                userId: userId,
                "profile.profileCummunityId": activeCommunity
            }).select("profile")
            .exec()
            .then(usr => {
                var pos = getProfileCommunityProsion(usr, activeCommunity)
                resolve(usr[0].profile[pos])
            })
    })
}


saveInvitation = (invitor, invitorId, invitedEmail, communityId) => {
    const invitation = new Invitation(invitationClass.classInvitationNewAccount(invitor, invitorId, invitedEmail, communityId))

    return new Promise((resolve, reject) => {
        invitation.save()
            .then(inv => {
                resolve(invitedEmail)
            }).catch(err => utils.defaultError())
    })
}

invitationIfExist = (email, userId, activeCommunity) => {
    return new Promise((resolve, reject) => {
        Invitation.find({
                invitationCommunityId: activeCommunity,
                invitatorId: userId,
                invitedEmail: email
            }).exec()
            .then(res => {
                resolve(res.length)
            })
    })
}

inviteNewContact = (email, userId, activeCommunity) => {

    return new Promise((resolve, reject) => {
        invitationIfExist(email, userId, activeCommunity)
            .then(count => {
                if (count == 0) {
                    getUserInformation(userId, activeCommunity)
                        .then(profileInvitor => {
                            saveInvitation(profileInvitor, userId, email, activeCommunity)
                                .then(invitedEmail => {
                                    emailRes = {
                                        value: invitedEmail,
                                        status: 200
                                    }
                                    resolve(emailRes)
                                }).catch(err => console.log("Err : ", err))
                        })
                } else {
                    emailRes = {
                        value: email,
                        status: 204
                    }
                    resolve(emailRes)
                }
            })


    })
}

getInvitedUserInformation = (user, activeCommunity) => {

    return new Promise((resolve, reject) => {
        var pos = getProfileCommunityProsion(user, activeCommunity)
        resolve(user[0].profile[pos])
    })
}

saveInvitationExistingUser = (invitedId, profileInvitor, profileInvited, userId, email, activeCommunity) => {
    const invitation = new Invitation(invitationClass.classInvitationExistingAccount(invitedId, profileInvitor, profileInvited, userId, email, activeCommunity))

    return new Promise((resolve, reject) => {
        invitation.save()
            .then(inv => {
                resolve(email)
            }).catch(err => console.log("Err : ", err))
    })
}

inviteExistingContactToCommunity = (email, existingUser, userId, activeCommunity) => {

    return new Promise((resolve, reject) => {
        invitationIfExist(email, userId, activeCommunity)
            .then(count => {
                if (count == 0) {
                    getUserInformation(userId, activeCommunity)
                        .then(profileInvitor => {
                            getInvitedUserInformation(existingUser, activeCommunity)
                                .then(profileInvited => {
                                    saveInvitationExistingUser(existingUser[0].userId, profileInvitor, profileInvited, userId, email, activeCommunity)
                                        .then(invitedEmail => {
                                            emailRes = {
                                                value: invitedEmail,
                                                status: 200
                                            }
                                            resolve(emailRes)
                                        }).catch(err => console.log("Err : ", err));
                                })
                        })
                } else {
                    emailRes = {
                        value: email,
                        status: 204
                    }
                    resolve(emailRes)
                }
            })


    })
}

checkIfCommunityExist = (email, activeCommunity) => {

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

emailExist = (email, userId, activeCommunity) => {

    return new Promise((resolve, reject) => {
        User.find({
                "credentials.email": email.value
            }).exec()
            .then(usr => {
                if (usr.length === 0) {
                    inviteNewContact(email.value, userId, activeCommunity)
                        .then(email => resolve(email))
                } else {
                    checkIfCommunityExist(email.value, activeCommunity)
                        .then(results => {
                            if (results === 1) {
                                let newEmail = {
                                    value: email.value,
                                    status: 500
                                }
                                resolve(newEmail)
                            } else if (results === 0) {
                                inviteExistingContactToCommunity(email.value, usr, userId, activeCommunity)
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
addContacts = (emails, userId, activeCommunity) => {
    let emailsList = [];

    return new Promise((resolve, reject) => {
        emails.map(email => {
            emailExist(email, userId, activeCommunity)
                .then(response => {
                    emailsList.push(response)
                    if (emails.length === emailsList.length)
                        resolve(emailsList)
                })
        })

    })
}

getImagePath = (req, imageBody) => {
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

    return new Promise((resolve, reject) => {
        User.find({
                "credentials.email": email
            }).exec()
            .then(usr => {
                if (usr.length === 0)
                    resolve(true)
                else
                    resolve(false)
            }).catch(err => utils.defaultError(res, err))

    })
}

//TODO REMOVE EXTRA EMAIL
createNewAccount = (value, res) => {
    userClass.creatNewAccountUser(value)
        .then(usr => {
            let user = new User(usr)
            user.save()
                .then(user => {
                    communityService.newUserCommunity(user);
                    let name = user.credentials.lastname;
                    //let msg = userEmails.accountFirstCrevaluevalueation(value.email, value.password);
                    // utils.sendEmail("Habee TEAM", value.email, "Confirmationi de creation de compte", msg);
                    emailCreation.sendEmailAccountCreation(value.email, "Confirmation de création du compte", value.email, value.password, name)
                    invitationService
                        .invitationService(user.credentials.email, user.userId, user.credentials.lastname, user.credentials.firstname)
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
            notificationStatus: users[0].notificationStatus,
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

getProfileCommunityProsion = (user, communityId) => {
    let i = 0;
    let pos = 0;

    user[0].profile.map(pr => {
        if (pr.profileCummunityId == communityId)
            pos = i;
        i++;
    })

    return pos;
}

editProfileByCommunityId = (user, profileName, image) => {
    return new Promise((resolve, reject) => {
        let fullname = profileName.split(' ');
        let firstname = "";
        let lastname = "";

        console.log("splice profile name  :", fullname.length)
        if (fullname.length > 1) {
            firstname = profileName.split(' ', 1)[0];
            lastname = "";
            let i = 2;
            while (i <= fullname.length) {
                lastname += profileName.split(' ', i)[i - 1] + " ";
                i++;
            }
        } else if (fullname.length == 1)
            firstname = profileName.split(' ', 1)[0];

        console.log("h11223 : ", firstname, lastname)
        user[0].credentials.firstname = firstname;
        user[0].credentials.lastname = lastname;
        user[0].profile.map(pr => {
            pr.profileDateOfLastUpdate = Date.now;
            pr.profileUsername = profileName;
            pr.profilePhoto = image;
        })
        resolve(user);
    })
}

updateUser = (res, user) => {

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
                msg: "Profile updated with success !"
            })
        });
}

updateProfile = (res, image, profileName, userId, communityId) => {

    User.find({
            userId: userId,
            "profile.profileCummunityId": communityId
        })
        .exec()
        .then(usr => {
            console.log("User profile : ", usr)
            let pos = getProfileCommunityProsion(usr, communityId);
            editProfileByCommunityId(usr, profileName, image)
                .then(user => updateUser(res, user));
        })
        .catch(err => utils.defaultError(res, err))
}


module.exports = {
    inviteExistingContactToCommunity,
    invitationIfExist,
    saveInvitation,
    inviteNewContact,
    checkIfCommunityExist,
    emailExist,
    getImagePath,
    getUserInformation,
    addContacts,
    updateUser,
    editProfileByCommunityId,
    getProfileCommunityProsion,
    updateProfile,
    updateFirstConnection,
    checkPassword,
    checkIfEmailExist,
    createNewAccount,
    loginUser
}