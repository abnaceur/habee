const mongoose = require('mongoose');
const Community = require("../models/community");


async function getCommunityNAme(comId) {
    return new Promise((resolve, reject) => {
        Community.find({
                communityId: comId,
                communityIsDeleted: false
            }).exec()
            .then(community => resolve(community[0].communityName))
            .catch(err => console.log("Error : ", err))
    })
}

async function classInvitationNewAccount(invitor, invitorId, invitedEmail, communityId) {

    return new Promise((resolve, reject) => {
        Community.find({
                communityId: communityId,
                communityIsDeleted: false
            }).exec()
            .then(community => {
                let classInvitation = {
                    _id: new mongoose.Types.ObjectId,
                    invitationCommunityId: communityId,
                    invitatorId: invitorId,
                    InvitationCommunitName: community[0].communityName,
                    invitorFullname: invitor.profileFirstname + " " + invitor.profileLastname,
                    invitedEmail: invitedEmail,
                    invitedId: "",
                    invitedFullname: "",
                    contactExist: false,
                    status: "pending",
                    notification: true
                }
                
                resolve(classInvitation)
            })
            .catch(err => console.log("Error : ", err))
    })
}

async function classInvitationExistingAccount (invitedId, invitor, invited, invitorId, invitedEmail, communityId) {

    return new Promise((resolve, reject) => {
        Community.find({
                communityId: communityId,
                communityIsDeleted: false
            }).exec()
            .then(community => {
                let classInvitation = {
                    _id: new mongoose.Types.ObjectId,
                    invitationCommunityId: communityId,
                    InvitationCommunitName: community[0].communityName,
                    invitatorId: invitorId,
                    invitorFullname: invitor.profileFirstname + " " + invitor.profileLastname,
                    invitedEmail: invitedEmail,
                    invitedId: invitedId,
                    invitedFullname: invited.profileFirstname + " " + invited.profileLastname,
                    contactExist: true,
                    status: "pending",
                    notification: true
                }

                resolve(classInvitation) 
            })
            .catch(err => console.log("Error : ", err))
    })
}


module.exports = {
    getCommunityNAme,
    classInvitationExistingAccount,
    classInvitationNewAccount
}