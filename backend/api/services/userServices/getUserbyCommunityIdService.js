const User = require('../../models/user')
const Community = require('../../models/community')
const Event = require('../../models/event')
const utils = require('../utils')

userResponse = (res, usrs, event) => {
    res.status(200).json({
        User: usrs.map(usr => {
            if (usr != undefined) {
                return {
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
    userResponse,
    getUserEventInfo,
    getUserInfo,
}