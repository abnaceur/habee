const User = require('../../models/user')
const Community = require('../../models/community')
const Event = require('../../models/event')
const utils = require('../utils')


nbrCommunityByCreationFun = (userId) => {
    return new Promise((resolve, reject) => {
        Community.find({
            communityCreator: userId,
            communityIsActive: true,
            communityIsDeleted: false,
        }).exec()
        .then(coms => {
            resolve(coms.length);
        })
    })
}

nbrCommunityByPrticipationFun = (userId) => {
    return new Promise((resolve, reject) => {
        Community.find({
            communityCreator: {
                "$ne": userId
            },
            communityMembers: {
                "$in": [userId]
            },
            communityIsActive: true,
            communityIsDeleted: false,
        }).exec()
        .then(coms => {
            resolve(coms.length);
        })
    })
}

async function userResponse (res, usrs, event) {
    let nbrCommunityByCreation = await nbrCommunityByCreationFun(usrs[0].userId)
    let nbrCommunityByPrticipation = await nbrCommunityByPrticipationFun(usrs[0].userId);
    res.status(200).json({
        User: usrs.map(usr => {
            if (usr != undefined) {
                return {
                    nbrCommunityByPrticipation: nbrCommunityByPrticipation,
                    nbrCommunityByCreation: nbrCommunityByCreation,
                    nbrCommunities: usr.communities.length,
                    eventCreated: event.length,
                    userId: usr.userId,
                    profile: usr.profile,
                    nbrEventsParticipated: usr.eventsParticipated.length,
                    profileIsActive: usr.profile.profileUserIsActive,
                    profileRole: usr.profile.profileIsAdmin,
                }
            }
        })
    });
}

getUserEventInfo = (res, id, usrs) => {

    Event.find({
            eventCreator: id,
            eventIsDeleted: false,
        }).exec()
        .then(event => {
            userResponse(res, usrs, event)
        })
}

getUserInfo = (req, res, id, communityId) => {

    User.find({
            userId: id,
        })
        .exec()
        .then(usrs => {
            if (usrs.length === 0) {
                return res.status(200).json({
                    message: "User not found or id not valid!"
                })
            } else {
                getUserEventInfo(res, id, usrs)
            }
        })
        .catch(err => {
            utils.defaultError(res, err)
        });
}

module.exports = {
    nbrCommunityByPrticipationFun,
    userResponse,
    nbrCommunityByCreationFun,
    getUserEventInfo,
    getUserInfo,
}