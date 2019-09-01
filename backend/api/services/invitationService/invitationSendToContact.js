const User = require('../../models/user')
const utils = require('../../services/utils')
const userClass = require('../../classes/userClass')
const userEmails = require('../../emailsTemplate/userEmails')
const communityService = require("../../services/communityServices/communityService");
const Invitation = require('../../models/invitation');
const invitationClass = require('../../classes/invitationClass')
const invitationService = require('../userServices/userInvitationService')
const emailCreation = require('../emailServices/accountCreationEmailservice')

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

checkInvitationStatus = (comId, email, userId) => {
    return new Promise((resolve, reject) => {
        Invitation.find({
            invitationCommunityId: comId,
            invitatorId: userId,
            invitedEmail: email
        }).exec()
            .then(res => {
                resolve(res.length)
            })
    })
}

invitationIfExist = (email, userId) => {
    return new Promise((resolve, reject) => {
        let i = 0;
        let z = 1;
        let TotalComs = email.communities.length;

        email.communities.map(async comId => {
            if (await checkInvitationStatus(comId, email.value, userId) > 0)
                email.communities.splice(email.communities.indexOf(comId), 1);
            if (z === TotalComs) {
                resolve(email);
            }
            z++;
            i++;
        })
    })
}

inviteNewContact = (email, userId) => {

    return new Promise((resolve, reject) => {
        invitationIfExist(email, userId)
            .then(results => {
                if (results.communities.length > 0) {
                    email = results;
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
                        communities: results.communities,
                        value: results.value,
                        status: 204,
                        check: "Ce contact est deja invite"
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

    console.log("here ==============>")
    return new Promise((resolve, reject) => {
        invitationIfExist(data, userId)
            .then(results => {
                if (results.communities.length > 0) {
                    data = results;
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
                        communities: results.communities,
                        value: results.value,
                        status: 204,
                        check: "Ce contact est deja inviet"
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
                    if (emails.length === emailsList.length) {
                        resolve(emailsList)
                    }
                })
        })

    })
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


module.exports = {
    inviteExistingContactToCommunity,
    invitationIfExist,
    saveInvitation,
    inviteNewContact,
    checkIfCommunityExist,
    emailExist,
    getUserInformation,
    addContacts,
    checkIfEmailExist,
    getComm,
    checkUser,
}