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

allMyEvents = (comdId, text, res, page) => {
    return new Promise((resolve, reject) => {

        Event.find({
            eventIsDeleted: false,
            eventIsOver: false,
            eventCommunity: {
                "$in": comdId
            },
            "$or": [
                { eventName: { $regex: text, $options: 'i' } },
                { eventDescription: { $regex: text, $options: 'i' } },
                { eventLocation: { $regex: text, $options: 'i' } },
            ]
        })
            .sort('eventStartDate')
            .skip(Number(page * 10))
            .limit(Number(10))
            .exec()
            .then(events => {
                resolve(events)
            }).catch(err => utils.defaultError(res, err))
    })
}

getAllMyEvents = (coms, text, res) => {
    return new Promise((resolve, reject) => {
        Event.find({
            eventIsDeleted: false,
            eventIsOver: false,
            eventCommunity: {
                "$in": coms
            },
            "$or": [
                { eventName: { $regex: text, $options: 'i' } },
                { eventDescription: { $regex: text, $options: 'i' } },
                { eventLocation: { $regex: text, $options: 'i' } },
            ]
        })
            .exec()
            .then(events => {
                resolve(events.length)
            }).catch(err => utils.defaultError(res, err))
    })
}

async function searchEventByInput(text, userId, res, page) {
    let communities = await getMyCommunities(userId, res)
    let events = await allMyEvents(communities, text.text, res, page);
    let totalEvents = await getAllMyEvents(communities, text.text, res)

    res.status(200).json({
        code: 200,
        Count: totalEvents,
        per_page: 10,
        total: totalEvents,
        total_pages: Math.floor(totalEvents / 10),
        events: events.map(event => {
            return eventService.eventModal(event)
        })
    })
}

module.exports = {
    searchEventByInput,
    getMyCommunities,
    getAllMyEvents
}