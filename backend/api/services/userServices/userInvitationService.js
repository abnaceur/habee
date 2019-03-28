const Invitation = require('../../models/invitation')
const userClass = require('../../classes/userClass');
const User = require('../../models/user')

getMyInvitations = (userId) => {
    return new Promise((resolve, reject) => {
        Invitation.find({
                invitedId: userId,
            }).exec()
            .then(invitation => {
                resolve(invitation);
            }).catch(err => console.log("getMyInvitations Err : ", err))
    })

}


listAllUserInvitation = (res, userId, communityId) => {
    Invitation.find({
            invitationCommunityId: communityId,
            invitatorId: userId,
        }).exec()
        .then(invitation => {
            getMyInvitations(userId)
                .then(myInvitations => {
                    let allInvit = myInvitations.concat(invitation)
                    res.status(200).json({
                        data: allInvit
                    })
                })
                .catch(err => console.log("listAllUserInvitation Err: ", err))
        }).catch(err => {
            res.status(500).json({
                Error: err
            })
        })
}


getReceivedInvitation = (userId) => {


    return new Promise((resolve, reject) => {
        Invitation.find({
                invitedId: userId,
                status: "pending",
                notification: true
            }).exec()
            .then(receivedInvitations => {
                resolve(receivedInvitations)
            })
            .catch(err => console.log("listAllUserInvitation Err: ", err))
    })
}

getAcceptedNotifications = (userId, communityId, status) => {
    return new Promise((resolve, reject) => {
        Invitation.find({
                invitationCommunityId: communityId,
                invitatorId: userId,
                status: status,
                notification: true
            }).exec()
            .then(accRejInvitation => {
                resolve(accRejInvitation)
            })
            .catch(err => console.log("listAllUserInvitation Err: ", err))
    })

}

updateNotif = (res, invitation) => {
    invitation.map(invit => {
        invit.notification = false
        Invitation.findByIdAndUpdate(invit._id,
            invit, {
                new: false,
            },
            function (err, results) {
                if (err) console.log("updateNotif Err : ", err);
                res.status(200).json({
                    count: invitation.length,
                    code: 200,
                    msg: "updated with success !"
                })
            })
    })
}

updateNotification = (res, userId, communityId) => {
    getReceivedInvitation(userId)
        .then(receivedInvitations => {
            getAcceptedNotifications(userId, communityId, "accepted")
                .then(acceptedInvit => {
                    getAcceptedNotifications(userId, communityId, "rejected")
                        .then(rejectedInvit => {
                            let arr1 = receivedInvitations.concat(acceptedInvit)
                            let arr2 = arr1.concat(rejectedInvit)
                            if (arr2.length > 0)
                                updateNotif(res, arr2)
                            else {
                                res.status(200).json({
                                    count: 0,
                                    code: 200,
                                    msg: "No updates!"
                                })
                            }

                        })
                        .catch(err => console.log("getAcceptedNotifications Err :", err))
                })
                .catch(err => console.log("getRejectedNotifications Err :", err))
        })
        .catch(err => console.log("getReceivedInvitation Err :", err))
}



invitationService = (email, userId, lastename, firstname) => {

    Invitation.find({
            invitedEmail: email
        }).exec()
        .then(invitations => {
            console.log("invitations account creation : ", invitations)
            invitations.map(invit => {
                invit.invitedId = userId;
                invit.invitedFullname = lastename + " " + firstname;
                invit.contactExist = true;
                Invitation.findByIdAndUpdate(invit._id,
                    invit, {
                        new: false,
                    },
                    function (err, results) {
                        if (err) console.log("invitationService Err : ", err);
                        console.log("invitation updated !")
                    })
            })
        })
        .catch(err => console.log("invitationService Err :", err))
}

updateInvitationOnStatus = (invit, res) => {

    Invitation.findByIdAndUpdate(invit._id,
        invit, {
            new: false,
        },
        function (err, results) {
            if (err) res.send(err);
            res.status(200).json({
                code: 200,
                msg: "Invitation rejected."
            })
        })
}


updateInvitationStatus = (invit, userId, res) => {
    if (invit.status == "rejected" && invit.contactExist == true) { 
        updateInvitationOnStatus(invit, res)
    } else if (invit.status == "accepted" && invit.contactExist == true) {
        User.find({
                userId: userId
            }).exec()
            .then(user => {
                userClass.userAddNewCommnity(invit, user)
                    .then(code => {
                        if (code == 200) {
                            Invitation.findByIdAndUpdate(invit._id,
                                invit, {
                                    new: false,
                                },
                                function (err, results) {
                                    if (err) console.log("updateInvitationStatus Err : ", err);
                                    res.status(200).json({
                                        code: 200,
                                        msg: "Invitation accepted."
                                    })
                                })
                        } else {
                            res.status(200).json({
                                code: 500,
                                msg: "Sorry!, something went wrong."
                            })
                        }
                    })
            })
            .catch(err => console.log("ERR : ", err))
    }
}

module.exports = {
    updateInvitationStatus,
    invitationService,
    updateNotif,
    getAcceptedNotifications,
    getReceivedInvitation,
    updateNotification,
    getMyInvitations,
    listAllUserInvitation
}