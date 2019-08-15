const Event = require('../../models/event');
const utils = require('../utils');
const User = require('../../models/user');
const Community = require('../../models/community');
const eventService = require('../eventService');

getMyCommunitiesNofilter = (userId, res) => {
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

allMyEventsNoFilter = (comdId, res, page) => {
    return new Promise((resolve, reject) => {

        Event.find({
            eventIsDeleted: false,
            eventIsOver: false,
            "$and": [
                {
                    "$or": [
                        { eventCommunity: { $in: comdId } },
                        { eventIsPublic: { $eq: true } },
                    ],
                }
            ],
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

getallMyEventsNoFilter = (coms, res) => {
    return new Promise((resolve, reject) => {
        Event.find({
            eventIsDeleted: false,
            eventIsOver: false,
            "$and": [
                {
                    "$or": [
                        { eventCommunity: { $in: coms } },
                        { eventIsPublic: { $eq: true } },
                    ],
                }
            ],
        })
            .exec()
            .then(events => {
                resolve(events.length)
            }).catch(err => utils.defaultError(res, err))
    })
}

async function getAllUserEvents(userId, res, page) {
    let communities = await getMyCommunitiesNofilter(userId, res)
    let events = await allMyEventsNoFilter(communities, res, page);
    let totalEvents = await getallMyEventsNoFilter(communities, res)

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
    getAllUserEvents
}