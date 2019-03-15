const User = require('../../models/user')
const utils = require('../utils')
const eventService = require('../eventService')
const Community = require("../../models/community")
const Event = require("../../models/event")

getCommunityName = (comId) => {
    Community.find({
        communityId: comId
    }).exec()
    .then(com => {
        console.log("Community : ", comm)
    }).catch(err => console.log("getCommunityName : Err ", err))
}

getUserEvent = (usr, res) => {
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
                           // console.log("Event :", event[z].eventCommunity)
                          //  getCommunityName(event[z].eventCommunity)
                            allUserEvents.push(event[z]);
                        }
                        z++;
                    }
                    z = 0;
                    i++;
                }
                usr[0].eventsParticipated = allUserEvents;

                res.status(200).json({
                    User: usr,
                    event: event
                });
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
                console.log("here ============")
                getUserEvent(usr, res)
            } else {
                console.log("here ")
                res.status(200).json({
                    User: usr
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
    getUserEvent,
    getCommunityName
}