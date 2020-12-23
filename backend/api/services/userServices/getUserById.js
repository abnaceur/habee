const User = require('../../models/user')
const utils = require('../utils')
const eventService = require('../eventService')
const Community = require("../../models/community")
const Event = require("../../models/event")
const eventComClass = require("../../classes/eventClass")

getCommunityName = (comId) => {
    return new Promise((resolve, reject) => {
        Community.find({
            communityId: comId
        }).exec()
            .then(com => {
                resolve(com[0].communityName)
            }).catch(err => console.log("getCommunityName : Err ", err))
    })
}

async function getAllEventCommunityname(res, events, usr) {
    let ev = [];
    let i = 0;

    while (i < usr[0].eventsParticipated.length) {
        ev.push(await getCommunityName(usr[0].eventsParticipated[i].eventCommunity)
            .then(data => {
                ev.push(eventComClass.eventAddComName(usr[0].eventsParticipated[i], data))
            }))
        i++;
    }


    i = 0;
    ev.map(event => {
        if (event === undefined || event === null)
            ev.splice(i, 1);
        i++;
    })

    res.status(200).json({
        User: ev,
        event: events
    });
}

getEventIds = (events) => {
    let ids = [];
    events.map(ev => {
        ids.push(ev.eventId);
    })

    return Promise.resolve(ids);
}

async function getUserEvent(usr, res) {
    let eventsParticipatedIds = await getEventIds(usr[0].eventsParticipated);
    Event.find({
        eventIsOver: false,
        eventIsDeleted: false,
        eventId: {
            "$in": eventsParticipatedIds
        }
    })
        .sort("eventStartDate")
        .exec()
        .then(event => {
            usr[0].eventsParticipated = event;
            getAllEventCommunityname(res, event, usr)
        })
}

getUserById = (id, res) => {
    User.find({
        userId: id
    })
        .exec()
        .then(usr => {
            if (usr.length === 0) {
                return res.status(200).json({
                    message: "User not found or id not valid!"
                })
            } else {
                if (usr[0].eventsParticipated.length != 0) {
                    getUserEvent(usr, res)
                } else {
                    res.status(200).json({
                        User: usr[0].eventsParticipated
                    });
                }
            }
        })
        .catch(err => {
            utils.defaultError(res, err)
        });
}


module.exports = {
    getUserById,
    getAllEventCommunityname,
    getUserEvent,
    getCommunityName
}