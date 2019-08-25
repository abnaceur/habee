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

    events.map(event => {
        updateEventIsOver(event)
    })

    events = await allMyEventsNoFilter(communities, res, page);

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

updateEventIsOver = (event) => {
    let formatedEndDate = formatDate(event).formatedEndDate;
    let currentDate = formatDate(event).currentdate;

    if (formatedEndDate <= currentDate) {
        event.eventIsOver = true;
        Event.findByIdAndUpdate(event._id,
            event, {
                new: false,
            },
            function (err, results) {
                if (err) return res.status(500).json(err);
                console.log("EVENT IS OVER")
            });
    }
}

formatDate = (event) => {
    const currentDate = new Date;
    const i = currentDate.toISOString().slice(0, 10) + "T00:59:18.132Z";
    const currentdate = new Date(i);
    const formatTime = "T" + event.eventEndHour.substring(0, 2) + ":" + event.eventEndHour.substring(3, 5) + ":00.000Z"
    const endDate = event.eventEndDate.toISOString().slice(0, 10) + formatTime
    const formatedEndDate = new Date(endDate)

    return ({
        formatedEndDate,
        currentdate
    });
}
module.exports = {
    getAllUserEvents
}