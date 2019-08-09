const Event = require('../../models/event');
const utils = require('../utils');
const User = require('../../models/user');
const Community = require('../../models/community');
const eventService = require('../eventService'); 

getMyCommunities = (userId, res) => {
    return new Promise((resolve, reject) => {
        Community.find({
            communityMembers: {
                "$in": userId
            }
        }).exec()
            .then(coms => {
                let comsId = [];
                coms.map(async cms => {
                    comsId.push(cms.communityId);
                })
                resolve(comsId);
            }).catch(err => utils.defaultError(res, err))
    })
}

allMyEvents = (comdId, text, res) => {
    return new Promise((resolve, reject) => {

        Event.find({
            eventCommunity: {
                "$in": comdId
            },
            "$or": [
                { eventName: { $regex: text, $options: 'i' } },
                { eventDescription: { $regex: text, $options: 'i' } },
                { eventLocation: { $regex: text, $options: 'i' } },
            ]
        })
            .exec()
            .then(events => {
                resolve(events)
            }).catch(err => utils.defaultError(res, err))
    })
}

async function searchEventByInput(text, userId, res) {
    let communities = await getMyCommunities(userId, res)
    let events = await allMyEvents(communities, text.text, res);

    res.status(200).json({
        code: 200,
        events: events.map(event => {
            return  eventService.eventModal(event)
        })
    })
}

module.exports = {
    searchEventByInput,
    getMyCommunities,

}