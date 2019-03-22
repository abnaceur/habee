const User = require('../../models/user')
const utils = require('../utils')

// sendProfileInfo = (res, user, communityId) => {
//     let i = 0;
//     let pos = 0;
//     let allusersProfile = [];

//     user.map(usr => {
//         usr.profile.map(pr => {
//             if (pr.profileCummunityId == communityId) {
//                 pos = i;
//                 if (usr.profile[pos] != null) {
//                     allusersProfile.push({
//                         userId: usr.userId,
//                         userEmail: usr.credentials.email,
//                         profileUsername: usr.profile[pos].profileUsername,
//                         profilePhoto: usr.profile[pos].profilePhoto
//                     })
//                 }
//             }
//             i++;
//         })
//         pos = 0;
//         i = 0;      
//     })

//     res.status(200).json({
//         users: allusersProfile
//     })
// }


sendProfileInfo = (res, user, communities) => {
    let allusersProfile = [];
    let coms = [];
    let i = 0

    user.map(usr => {
        while (i < usr.communities.length) {
            communities.map(cm => {
                if (cm == usr.communities[i])
                    coms.push(cm)
            })
            i++;
        }


        allusersProfile.push({
            communities: coms,
            userId: usr.userId,
            userEmail: usr.credentials.email,
            profileUsername: usr.profile.profileFirstname + " " + usr.profile.profileLastname,
            profilePhoto: usr.profile.profilePhoto
        })
        i = 0;
    })

    res.status(200).json({
        users: allusersProfile
    })
}



getUserProfileInfo = (req, res, communityId) => {
    let communities = [];

    req.body.map(com => {
        communities.push(com.communityId)
    })

    User.find({
            communities: {
                "$in": communities
            }
        })
        .exec()
        .then(users => {
            if (users.length === 0) {
                return res.status(404).json({
                    message: "There are no users !"
                })
            } else {
                sendProfileInfo(res, users, communities)
            }
        })
        .catch(err => utils.defaultError(res, err))
}

module.exports = {
    getUserProfileInfo,
    sendProfileInfo
}