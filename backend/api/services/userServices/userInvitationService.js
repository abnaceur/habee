const Invitation = require('../../models/invitation')


getMyInvitations = (userId) => {
   
    return new Promise((resolve, reject) => {
        Invitation.find({
            invitedId: userId,
        }).exec()
        .then(invitation => {
            console.log("invitation to me :", invitation);
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


module.exports = {
    getMyInvitations,
    listAllUserInvitation
}