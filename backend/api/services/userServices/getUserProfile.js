const User = require('../../models/user')
const utils = require('../utils')
const Community = require("../../models/community")
const Invitation = require("../../models/invitation")

async function getComInfo(usr, communities) {
    let i = 0;
    let coms = [];

    return new Promise((resolve, reject) => {
        while (i <= usr.communities.length) {
            communities.map(async cm => {
                if (cm.communityId == usr.communities[i]) {
                    coms.push(cm)
                }
            })
            i++;
        }
        resolve(coms)
    })
}

async function sendProfileInfo(res, user, communities) {
    let allusersProfile = [];



    user.map(async (usr) => {
        allusersProfile.push({
            communities: await getComInfo(usr, communities),
            userId: usr.userId,
            userEmail: usr.credentials.email,
            profileUsername: usr.profile.profileFirstname + " " + usr.profile.profileLastname,
            profilePhoto: usr.profile.profilePhoto
        })
    })

    User.find({
        communities: {
            "$in": communities
        }
    })
        .exec()
        .then(users => {
            res.status(200).json({
                users: allusersProfile,
                per_page: 10,
                total: users.length,
                total_pages: Math.floor(users.length / 10),
            })
        })
}



getUserProfileInfo = (req, res, page, userId) => {
    let communitiesId = [];
    let pageTmp = 0;
    let communities = [];
    let userIds = [];

    if (page != undefined)
        pageTmp = page;

    // console.log("req.body :, ", req.body);

    req.body.map(com => {
        userIds = userIds.concat(com.communityMembers)
        communitiesId.push(com.communityId);
        communities.push(com);
    })

    // console.log("communitiesId :", communitiesId);
    // Invitation.find({
    //         invitationCommunityId: {
    //             "$in": communitiesId
    //         },
    //         invitatorId: userId,
    //         status: "accepted"
    //     })
    //     .skip(Number(pageTmp * 10))
    //     .limit(Number(10))
    //     .exec()
    //     .then(invits => {
    //         console.log("invits :", invits);
    //         let usrIds = [];

    //         invits.map(usrId => {
    //             usrIds.push(usrId.invitedId)
    //         })

    let uniqIds = [...new Set(userIds)];
    console.log("uniqIds ", uniqIds);

    uniqIds.push(userId)

    User.find({
        userId: {
            "$in": uniqIds,
        },
        communities: {
            "$in": communitiesId
        }
    })
        .skip(Number(pageTmp * 10))
        .limit(Number(10))
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
    // }).catch(err => utils.defaultError(res, err))

}

module.exports = {
    getComInfo,
    getUserProfileInfo,
    sendProfileInfo
}