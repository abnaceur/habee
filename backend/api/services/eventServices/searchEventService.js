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
            "$and": [
                {
                    "$or": [
                        { eventCommunity: { $in: comdId } },
                        { eventIsPublic: { $eq: true } },
                    ],
                }
            ],
            "$or": [
                { eventName: { $regex: text, $options: 'i' } },
                { eventDescription: { $regex: text, $options: 'i' } },
                { eventLocation: { $regex: text, $options: 'i' } },
                { eventCategory: { $regex: text, $options: 'i' } },
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
            "$and": [
                {
                    "$or": [
                        { eventCommunity: { $in: coms } },
                        { eventIsPublic: { $eq: true } },
                    ],
                }
            ],
            "$or": [
                { eventName: { $regex: text, $options: 'i' } },
                { eventDescription: { $regex: text, $options: 'i' } },
                { eventLocation: { $regex: text, $options: 'i' } },
                { eventCategory: { $regex: text, $options: 'i' } },
            ]
        })
            .exec()
            .then(events => {
                resolve(events.length)
            }).catch(err => utils.defaultError(res, err))
    })
}


findCommunities = (comId) => {
    return new Promise((resolve, reject) => {
        Community.find({
            communityId: comId
        }).exec()
            .then(com => {
                if (com.length > 0)
                    resolve(com[0].communityName)
                else
                    resolve("");
            }).catch(err => console.log("getEventComNames ERR :", err))
    })
}

getEventComNames = (communities) => {
    return new Promise((resolve, reject) => {
        let comNames = [];
        let i = 1
        communities.map(async com => {
            comNames.push(await findCommunities(com));
            if (i === communities.length)
                resolve(comNames);
            i++;
        })
    })
}

async function searchEventByInput(text, userId, res, page) {
    let communities = await getMyCommunities(userId, res)
    let events = await allMyEvents(communities, text.text, res, page);
    let totalEvents = await getAllMyEvents(communities, text.text, res)

    let i = 0;
    let eventCommunitiesName = [];


    console.log("Event :", events.length);
    if (events.length === 0) {
        res.status(200).json({
            code: 200,
            Count: totalEvents,
            per_page: 10,
            total: totalEvents,
            total_pages: Math.floor(totalEvents / 10),
            comNames: eventCommunitiesName,
            events: events.map(event => {
                return eventService.eventModal(event)
            })
        })
    } else {
        await events.map(async event => {
            await eventCommunitiesName.push(await getEventComNames(event.eventCommunity));
            i++;

            if (i === events.length)
                res.status(200).json({
                    code: 200,
                    Count: totalEvents,
                    per_page: 10,
                    total: totalEvents,
                    total_pages: Math.floor(totalEvents / 10),
                    comNames: eventCommunitiesName,
                    events: events.map(event => {
                        return eventService.eventModal(event)
                    })
                })
        })
    }
}

module.exports = {
    searchEventByInput,
    getMyCommunities,
    getAllMyEvents,
    allMyEvents
}