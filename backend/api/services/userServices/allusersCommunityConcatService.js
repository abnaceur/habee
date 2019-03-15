const User = require('../../models/user')
const Community = require('../../models/community')
const utils = require('../utils')

getCommunityMemberByParticipation = (userId) => {
    return new Promise((resolve, reject) => {
        Community.find({
                communityMembers: {
                    "$in": [userId]
                },
                communityIsDeleted: false
            }).exec()
            .then(comPart => {
                resolve(comPart)
            })
            .catch(err => console.log("Error :", err))
    })
}

getUserInfo = (userId) => {
    return new Promise((resolve, reject) => {
        User.find({
                userId: userId,
            }).exec()
            .then(userInfo => {
                resolve(userInfo)
            })
            .catch(err => console.log("Error :", err))
    })
}

async function getMembersInformation (uniqMembers) {
    let i = 0;
    let UsersInfo = [];

    while (i < uniqMembers.length) {
        UsersInfo = UsersInfo.concat(await getUserInfo(uniqMembers[i])
            .then(data => {
                return ({
                    userId: data[0].userId,
                    profileCummunityId: data[0].profile[0].profileCummunityId,
                    profilePhoto: data[0].profile[0].profilePhoto,
                    profileUsername: data[0].profile[0].profileUsername,
                });
            }))
        i++;
    }

    return new Promise((resolve, reject) => {
        resolve(UsersInfo)
    });

}

AllusersCommunityConcat = (res, userId) => {
    Community.find({
            communityCreator: userId,
            communityIsDeleted: false
        }).exec()
        .then(comCreated => {
            getCommunityMemberByParticipation(userId)
                .then(comByPart => {
                    let memebers = [];
                    comCreated.map(cc => {
                        memebers = memebers.concat(...cc.communityMembers)
                    })
                    comByPart.map(cc => {
                        memebers = memebers.concat(...cc.communityMembers)
                    })
                    let uniqMembers = [...new Set(memebers)];
                    getMembersInformation(uniqMembers)
                        .then(memInfos => {
                            res.status(200).json({
                                msg: 200,
                                users: memInfos
                            })
                        })
                }).catch(err => utils.defaultError(res, err))
        })
        .catch(err => utils.defaultError(res, err)) 
}


module.exports = {
    getUserInfo,
    AllusersCommunityConcat,
    getMembersInformation,
    getCommunityMemberByParticipation
}