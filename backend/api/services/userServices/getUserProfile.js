const User = require('../../models/user')
const utils = require('../utils')

sendProfileInfo = (res, user, communityId) => {
    let i = 0;
    let pos = 0;
    let allusersProfile = [];

    user.map(usr => {
        usr.profile.map(pr => {
            if (pr.profileCummunityId == communityId) {
                pos = i;
                if (usr.profile[pos] != null) {
                    allusersProfile.push({
                        userId: usr.userId,
                        profileUsername: usr.profile[pos].profileUsername,
                        profilePhoto: usr.profile[pos].profilePhoto
                    })
                }
            }
            i++;
        })
        pos = 0;
        i = 0;      
    })
    
    res.status(200).json({
        users: allusersProfile
    })
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