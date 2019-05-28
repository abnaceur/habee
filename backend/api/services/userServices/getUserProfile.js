const User = require('../../models/user')
const utils = require('../utils')
const Community = require("../../models/community")
const Invitation = require("../../models/invitation")

async function getCommunity(comId) {
    return new Promise((resolve, reject) => {
        Community.find({
            communityId: comId
        }).then(community => {
            resolve(community[0])
        });
    }).catch(err => console.log("Error : ", err))
}


async function getComInfo(usr, communities) {
    let i = 0;
    let coms = [];

    return new Promise((resolve, reject) => {
        while (i <= usr.communities.length) {
            communities.map(async cm => {
                if (cm == usr.communities[i]) {
                    coms.push(await getCommunity(cm))
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
    let communities = [];
    let pageTmp = 0

    if (page != undefined)
        pageTmp = page;

    req.body.map(com => {
        communities.push(com.communityId)
    })

    Invitation.find({
            invitationCommunityId: {
                "$in": communities
            },
            invitatorId: userId,
            status: "accepted"
        })
        .skip(Number(pageTmp * 10))
        .limit(Number(10))
        .exec()
        .then(invits => {
            let usrIds = [];

            invits.map(usrId => {
                usrIds.push(usrId.invitedId)
            })

            let uniqIds = [...new Set(usrIds)];
            uniqIds.push(userId)

            User.find({
                    userId: {
                        "$in": uniqIds,
                    },
                    communities: {
                        "$in": communities
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
        }).catch(err => utils.defaultError(res, err))

}

module.exports = {
    getComInfo,
    getUserProfileInfo,
    getCommunity,
    sendProfileInfo
}