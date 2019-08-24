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

getUserInformation = (userId) => {
    return new Promise((resolve, reject) => {
        User.find({
            userId: userId,
        }).select("profile")
            .exec()
            .then(usr => {
                resolve(usr[0].profile)
            })
    })
}


async function saveInvitation(invitor, invitorId, invitedEmail, communityIds) {
    communityIds.map(async comId => {
        const invitation = new Invitation(await invitationClass.classInvitationNewAccount(invitor, invitorId, invitedEmail, comId))
        invitation.save()
            .then(inv => console.log("SAVED INVITATION")).catch(err => console.log("Error ==> : ", err))
    })

    return new Promise((resolve, reject) => {
        resolve(invitedEmail)
    })
}

invitationIfExist = (email, userId) => {
    return new Promise((resolve, reject) => {
        let i = 0;
        email.communities.map(comId => {
            Invitation.find({
                invitationCommunityId: comId,
                invitatorId: userId,
                invitedEmail: email.value
            }).exec()
                .then(res => {
                    resolve(res.length)
                })
        })
    })
}

inviteNewContact = (email, userId) => {

    return new Promise((resolve, reject) => {
        invitationIfExist(email, userId)
            .then(count => {
                if (count == 0) {
                    getUserInformation(userId)
                        .then(profileInvitor => {
                            saveInvitation(profileInvitor, userId, email.value, email.communities)
                                .then(invitedEmail => {
                                    emailRes = {
                                        value: invitedEmail,
                                        communities: email.communities,
                                        status: 200
                                    }
                                    resolve(emailRes)
                                }).catch(err => console.log("Err : ", err))
                        })
                } else {
                    emailRes = {
                        communities: email.communities,
                        value: email.value,
                        status: 204
                    }
                    resolve(emailRes)
                }
            })


    })
}

getInvitedUserInformation = (user) => {

    return new Promise((resolve, reject) => {
        resolve(user[0].profile)
    })
}

saveInvitationExistingUser = (invitedId, profileInvitor, profileInvited, userId, email, communityIds) => {

    communityIds.map(async comId => {
        const invitation = new Invitation(await invitationClass.classInvitationExistingAccount(invitedId, profileInvitor, profileInvited, userId, email, comId))
        invitation.save()
            .then(inv => console.log("SAVED INVITATION")).catch(err => console.log("Error ==> : ", err))
    })

    return new Promise((resolve, reject) => {
        resolve(email)
    })
}

inviteExistingContactToCommunity = (data, existingUser, userId) => {

    return new Promise((resolve, reject) => {
        invitationIfExist(data, userId)
            .then(count => {
                if (count == 0) {
                    getUserInformation(userId)
                        .then(profileInvitor => {
                            getInvitedUserInformation(existingUser)
                                .then(profileInvited => {
                                    saveInvitationExistingUser(existingUser[0].userId, profileInvitor, profileInvited, userId, data.value, data.communities)
                                        .then(invitedEmail => {
                                            emailRes = {
                                                communities: data.communities,
                                                value: invitedEmail,
                                                status: 200
                                            }
                                            resolve(emailRes)
                                        }).catch(err => console.log("Err : ", err));
                                })
                        })
                } else {
                    emailRes = {
                        communities: data.communities,
                        value: data.email,
                        status: 204
                    }
                    resolve(emailRes)
                }
            })


    })
}

async function checkUser(email, com) {

    return new Promise((resolve, reject) => {
        User.find({
            "credentials.email": email,
            communities: {
                "$in": [com]
            }
        }).exec()
            .then(usr => {
                if (usr.length === 0)
                    resolve(com);
                else
                    resolve([]);
            })
    })
}

async function getComm(allCommunities, email) {
    let communities = [];
    let i = 0;

    while (i < allCommunities.length) {
        communities.push(await checkUser(email, allCommunities[i]));
        i++;
    }
    return new Promise((resolve, reject) => {
        resolve(communities)
    })
}


async function checkIfCommunityExist(email, allCommunities) {
    let data = await getComm(allCommunities, email)

    return new Promise((resolve, reject) => {
        resolve(data)
    })
}

emailExist = (email, userId) => {
    return new Promise((resolve, reject) => {
        User.find({
            "credentials.email": email.value
        }).exec()
            .then(usr => {
                if (usr.length === 0) {
                    inviteNewContact(email, userId)
                        .then(emailValue => resolve(emailValue))
                } else {
                    if (usr[0].userId === userId) {
                        let newEmail = {
                            communities: email.communities,
                            value: email.value,
                            status: 500,
                            check: "Vous ne pouvez pas envoyer une invitation a vous meme."
                        }
                        resolve(newEmail)
                    } else {
                        checkIfCommunityExist(email.value, email.communities)
                            .then(results => {
                                if (results.length === 0) {
                                    let newEmail = {
                                        communities: email.communities,
                                        value: email.value,
                                        status: 500
                                    }
                                    resolve(newEmail)
                                } else if (results.length >= 1) {
                                    inviteExistingContactToCommunity(email, usr, userId)
                                        .then(email => {
                                            resolve(email)
                                        })
                                }
                            })
                    }
                }
            })
    })
}


// This is the main function 
addContacts = (emails, userId) => {
    let emailsList = [];
    return new Promise((resolve, reject) => {
        emails.map(email => {
            emailExist(email, userId)
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
                        msg: "Account created with success"
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
            userFullname: users[0].profile.profileFirstname + " " + users[0].profile.profileLastname,
            userImage: users[0].profile.profilePhoto,
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

editProfileByCommunityId = (user, profileInfo, image) => {
    return new Promise((resolve, reject) => {
        user[0].credentials.firstname = profileInfo.profileFirstname;
        user[0].credentials.lastname = profileInfo.profileLastname;
        user[0].profile.profileDateOfLastUpdate = Date.now;
        user[0].profile.profileLastname = profileInfo.profileLastname;
        user[0].profile.profileFirstname = profileInfo.profileFirstname;
        user[0].profile.profilePhoto = image;
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

updateProfile = (res, image, profileInfo, userId) => {

    User.find({
        userId: userId,
    })
        .exec()
        .then(usr => {
            editProfileByCommunityId(usr, profileInfo, image)
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
    getComm,
    checkUser,
    loginUser
}