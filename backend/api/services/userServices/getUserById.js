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
            console.log("Community : ", com[0].communityName)
            resolve(com[0].communityName) 
        }).catch(err => console.log("getCommunityName : Err ", err))
    })
}

async function  getAllEventCommunityname (res, events, usr) {
    let ev = [];
    let i = 0;

    while (i < usr[0].eventsParticipated.length) {
        ev.push(await getCommunityName(usr[0].eventsParticipated[i].eventCommunity)
            .then(data => {
                console.log("Data : ", ev)
                ev.push(eventComClass.eventAddComName(usr[0].eventsParticipated[i], data))
            }))
        i++;
    }

    //TODO REMOVE THE NULL FILED
    res.status(200).json({
        User: ev,
        event: events
    });
}

async function getUserEvent(usr, res) {
    Event.find({
            eventCommunity: usr[0].activeCommunity,
            eventIsOver: false,
            eventIsDeleted: false,
        }).exec()
        .then(event => {
            eventService.getAllpublicEvents()
                .then(ev => {
                    event = utils.concatArraysUser(event, ev)

                    let allUserEvents = [];
                    let i = 0;
                    let z = 0;

                    while (i < usr[0].eventsParticipated.length) {
                        while (z < event.length) {
                            if (usr[0].eventsParticipated[i].eventId == event[z].eventId) {                                
                                allUserEvents.push(event[z]);
                            }
                            z++;
                        }
                        z = 0;
                        i++;
                    }
                    usr[0].eventsParticipated = allUserEvents;
                    getAllEventCommunityname(res, event, usr)
                })
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
                    console.log("here ")
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