const User = require('../../models/user')
const utils = require('../../services/utils')
const userClass = require('../../classes/userClass')
const userEmails = require('../../emailsTemplate/userEmails')
const communityService = require("../../services/communityServices/communityService");
const Invitation = require('../../models/invitation');
const invitationClass = require('../../classes/invitationClass')
const invitationService = require('../userServices/userInvitationService')
const emailCreation = require('../emailServices/accountCreationEmailservice')

getUserInformationQrcode = (userId) => {
    return new Promise((resolve, reject) => {
        User.find({
            userId: userId,
        })
            .exec()
            .then(usr => {
                resolve({ profile: usr[0].profile, email: usr[0].credentials.email })
            })
    })
}

checkInvitationStatus = (comId, invitorId, userId) => {
    return new Promise((resolve, reject) => {
        Invitation.find({
            invitationCommunityId: comId,
            invitedId: userId,
            invitatorId: invitorId
        }).exec()
            .then(res => {
                resolve(res.length)
            })
    })
}

invitationIfExistQrCode = (email, userId, invitorId) => {
    return new Promise((resolve, reject) => {
        let i = 0;
        let z = 1;
        let TotalComs = email.communities.length;

        email.communities.map(async comId => {
            if (await checkInvitationStatus(comId, invitorId, userId) > 0)
                email.communities.splice(email.communities.indexOf(comId), 1);
            if (z === TotalComs) {
                resolve(email);
            }
            z++;
            i++;
        })
    })
}


getInvitedUserInformationQrCode = (user) => {

    return new Promise((resolve, reject) => {
        resolve(user[0].profile)
    })
}

saveInvitationExistingUserQrCode = (invitorId, profileInvitor, profileInvited, invitedId, email, communityIds) => {

    communityIds.map(async comId => { //invitedId, invitor, invited, invitorId, invitedEmail, communityId
        const invitation = new Invitation(await invitationClass.classInvitationExistingAccount(invitedId, profileInvitor, profileInvited, invitorId, email, comId))
        invitation.save()
            .then(inv => console.log("SAVED INVITATION")).catch(err => console.log("Error ==> : ", err))
    })

    return new Promise((resolve, reject) => {
        resolve(email)
    })
}

inviteExistingContactToCommunityQrCode = (data, existingUser, userId) => {

    return new Promise((resolve, reject) => {
        invitationIfExistQrCode(data, userId, existingUser[0].userId)
            .then(results => {
                if (results.communities.length > 0) {
                    data = results;
                    getUserInformationQrcode(userId)
                        .then(profileInvitedInfo => {
                            let profileInvited = profileInvitedInfo.profile;
                            let invitedEmail = profileInvitedInfo.email;
                            getInvitedUserInformationQrCode(existingUser)
                                .then(profileInvitor => {
                                    saveInvitationExistingUserQrCode(existingUser[0].userId, profileInvitor, profileInvited, userId, invitedEmail, data.communities)
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
                        check: "Vous etes déjà inscrit a ses communautés"
                    }
                    resolve(emailRes)
                }
            })


    })
}

async function checkUserQrCode(email, com) {

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

async function getCommQrCode(allCommunities, email) {
    let communities = [];
    let i = 0;

    while (i < allCommunities.length) {
        communities.push(await checkUserQrCode(email, allCommunities[i]));
        i++;
    }
    return new Promise((resolve, reject) => {
        resolve(communities)
    })
}


async function checkIfCommunityExistQrCode(email, allCommunities) {
    let data = await getCommQrCode(allCommunities, email)

    return new Promise((resolve, reject) => {
        resolve(data)
    })
}

emailExistQrCode = (email, userId) => {
    return new Promise((resolve, reject) => {
        User.find({
            "credentials.email": email.value
        }).exec()
            .then(usr => {
                if (usr.length === 0) {
                    let newEmail = {
                        communities: email.communities,
                        value: email.value,
                        status: 500,
                        check: "Cet utilisateur n'exist pas."
                    }
                    resolve(newEmail)
                } else if (usr[0].userId === userId) {
                    let newEmail = {
                        communities: email.communities,
                        value: email.value,
                        status: 500,
                        check: "Vous ne pouvez pas envoyer une invitation a vous meme."
                    }
                    resolve(newEmail)
                } else {
                    checkIfCommunityExistQrCode(email.value, email.communities)
                        .then(results => {
                            if (results.length === 0) {
                                let newEmail = {
                                    communities: email.communities,
                                    value: email.value,
                                    status: 500
                                }
                                resolve(newEmail)
                            } else if (results.length >= 1) {
                                inviteExistingContactToCommunityQrCode(email, usr, userId)
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
addContactsQrCode = (emails, userId) => {
    let emailsList = [];
    return new Promise((resolve, reject) => {
        emails.map(email => {
            emailExistQrCode(email, userId)
                .then(response => {
                    emailsList.push(response)
                    if (emails.length === emailsList.length) {
                        resolve(emailsList)
                    }
                })
        })

    })
}

module.exports = {
    addContactsQrCode,
}