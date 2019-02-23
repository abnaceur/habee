const mongoose = require('mongoose');

exports.classInvitationNewAccount = (invitor, invitorId, invitedEmail, communityId) => {

    console.log("Invitor : ", invitor)

    let classInvitation = {
        _id: new mongoose.Types.ObjectId,
        invitationCommunityId: communityId,
        invitatorId: invitorId,
        invitorFullname: invitor.profileUsername,
        invitedEmail: invitedEmail,
        invitedId: "",
        invitedFullname: "",
        contactExist: false,
        status: "pending",
        notification: true
    }

    return classInvitation
}

exports.classInvitationExistingAccount = (invitedId, invitor, invited, invitorId, invitedEmail, communityId) => {

    let classInvitation = {
        _id: new mongoose.Types.ObjectId,
        invitationCommunityId: communityId,
        invitatorId: invitorId,
        invitorFullname: invitor.profileUsername,
        invitedEmail: invitedEmail,
        invitedId: invitedId,
        invitedFullname: invited.profileUsername,
        contactExist: true,
        status: "pending",
        notification: true
    }

    return classInvitation
}