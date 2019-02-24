const User = require('../../models/user')
const utils = require('../utils')

sendProfileInfo = (res, user, communityId) => {
    let i = 0;
    let pos = 0;

    user[0].profile.map(pr => {
        if (pr.profileCummunityId == communityId)
            pos = i;
        i++;
    })

    res.status(200).json({
        users: user.map(usr => {
            return {
                userId: usr.userId,
                profileUsername: usr.profile[pos].profileUsername,
                profilePhoto: usr.profile[pos].profilePhoto,
            }
        })
    });
}



getUserProfileInfo = (res, communityId) => {

    User.find({
        "profile.profileCummunityId": communityId,
        "profile.profileUserIsDeleted": false,
        "profile.profileUserIsActive": true,
    })
    .exec()
    .then(users => {
        if (users.length === 0) {
            return res.status(404).json({
                message: "There are no users !"
            })
        } else {
            sendProfileInfo(res, users, communityId)
        }
    })
    .catch(err => utils.defaultError(res, err))
}

module.exports = {
    getUserProfileInfo,
    sendProfileInfo
}