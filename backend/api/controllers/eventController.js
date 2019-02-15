const express = require('express');
const Event = require('../models/event');
const User = require('../models/user');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const utils = require('../services/utils');
const eventService = require('../services/eventService')

exports.get_all_events = (req, res, next) => {
    Event.find()
        .exec()
        .then(events => {
            if (events.length === 0) {
                return res.status(200).json({
                    message: "There are no events!"
                })
            } else {
                res.status(200).json({
                    Count: events.length,
                    Events: events.map(event => {
                        return eventService.eventModal(event)
                    })
                });
            }
        })
        .catch(err => {
            utils.defaultError(res, err)
        })
};

exports.get_userEventSubscribed = (req, res, next) => {
    let eventId = req.params.eventId;
    let userId = req.params.userId;
    let communityId = req.params.communityId;

    Event.find({
            eventId: eventId,
            eventCommunity: communityId,
            "participants.participantId": userId,
        }).exec()
        .then(event => {
            res.status(200).json({
                event: event
            })
        }).catch(err => {
            utils.defaultError(res, err)
        })
}

exports.upload_mobile_photo = (req, res, next) => {
    if (req.files[0].path != undefined) {
        res.send(req.files[0].path)
    } else {
        utils.defaultError(res, err)
    }
}

//TODO HUNDLE USER NO COMMUNITY
exports.getNoevent = (req, res, next) => {

    res.status(200).json({
        Count: 0,
        Events: []
    });
}

exports.postEventFilter = (req, res, next) => {
    let userId = req.params.userId;
    let communityId = req.params.communityId;

    User.find({
            userId: userId
        })
        .exec()
        .then(usr => {
            let z = utils.getFilterPosition(usr[0].filterEvent, communityId);
            req.body.filterCommunity = communityId;
            req.body.filterCommunity = communityId;
            usr[0].filterEvent[z] = req.body;
            User.findByIdAndUpdate(usr[0]._id,
                usr[0], {
                    new: false,
                },
                function (err, results) {
                    if (err) return res.status(500).json(err);
                    console.log("FILTER UPDATED")
                });
        })
}

exports.getEventFilter = (req, res, next) => {
    let userId = req.params.userId;
    let communityId = req.params.communityId;

    User.find({
            userId: userId,
            "filterEvent.filterCommunity": communityId
        })
        .select("filterEvent")
        .exec()
        .then(usr => {
            let z = utils.getFilterPosition(usr[0].filterEvent, communityId);
            res.status(200).json({
                filterEvent: usr[0].filterEvent[z]
            })
        })
}

exports.getFilteredEvent = (req, res, next) => {
    let userId = req.params.userId;
    let communityId = req.params.communityId;



    User.find({
            userId: userId,
            "filterEvent.filterCommunity": communityId
        })
        .select("filterEvent")
        .exec()
        .then(usr => {

            let filter = utils.getFilterBycommunityId(usr[0].filterEvent, communityId);
            Event.find({
                    eventCommunity: communityId,
                    eventIsOver: false,
                    eventIsDeleted: false,
                })
                .exec()
                .then(activeEvent => {
                    if (activeEvent.length === 0 && filter.PublicValue === true) {
                        utils.filterEvents(activeEvent, filter, userId)
                            .then(filteredEvent => {
                                res.status(200).json({
                                    Count: filteredEvent.length,
                                    Events: filteredEvent.map(event => {
                                        return eventService.eventModal(event)
                                    })
                                });
                            })
                    } else if (activeEvent.length === 0) {
                        return res.status(200).json({
                            message: "There are no events!"
                        })
                    } else {
                        console.log("test11")
                        activeEvent.map(event => {
                            console.log("ddd123", event)
                            eventService.updateEcevntIsOver(event)
                        })
                        Event.find({
                                eventCommunity: communityId,
                                eventIsOver: false,
                                eventIsDeleted: false,
                            })
                            .exec()
                            .then(events => {
                                if (events.length === 0) {
                                    return res.status(200).json({
                                        message: "There are no events!"
                                    })
                                } else {
                                    utils.filterEvents(events, filter, userId)
                                        .then(filteredEvent => {
                                            res.status(200).json({
                                                Count: filteredEvent.length,
                                                Events: filteredEvent.map(event => {
                                                    return eventService.eventModal(event)
                                                })
                                            });
                                        })
                                }
                            })
                            .catch(err => {
                                utils.defaultError(res, err)
                            })
                    }
                })
                .catch(err => {
                    utils.defaultError(res, err)
                })

        })

}

exports.get_all_events_byCommunityId = (req, res, next) => {

    let communityId = req.params.communityId;

    Event.find({
            eventCommunity: communityId,
            eventIsOver: false,
            eventIsDeleted: false,
        })
        .exec()
        .then(activeEvent => {
            if (activeEvent.length === 0) {
                return res.status(200).json({
                    message: "There are no events!"
                })
            } else {
                let currentDate = new Date;
                activeEvent.map(event => {
                    let i = currentDate.toISOString().slice(0, 10) + "T00:59:18.132Z";
                    let currentMdate = new Date(i);
                    if (event.eventEndDate <= currentMdate) {
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
                })
                Event.find({
                        eventCommunity: communityId,
                        eventIsOver: false,
                        eventIsDeleted: false,
                    })
                    .exec()
                    .then(events => {
                        if (events.length === 0) {
                            return res.status(404).json({
                                message: "There are no events!"
                            })
                        } else {
                            res.status(200).json({
                                Count: events.length,
                                Events: events.map(event => {
                                    return eventService.eventModal(event)
                                })
                            });
                        }
                    })
                    .catch(err => {
                        utils.defaultError(res, err)
                    })
            }
        })
        .catch(err => {
            utils.defaultError(res, err)
        })
};

exports.post_event = (req, res, next) => {
    let imagePath;

    if (req.body.eventPhoto != undefined)
        imagePath = req.body.eventPhoto;
    else if (req.files == undefined)
        imagePath = "uploads/defaultEventImage.jpeg"
    else if (req.files != undefined)
        imagePath = req.files[0].path;

    const event = new Event({
        _id: new mongoose.Types.ObjectId,
        eventId: req.body.eventId,
        eventCommunity: req.body.eventCommunity,
        eventName: req.body.eventName,
        eventPhoto: imagePath,
        eventCreator: req.body.eventCreator,
        eventDescription: req.body.eventDescription,
        eventStartDate: req.body.eventStartDate,
        eventEndDate: req.body.eventEndDate,
        eventStartHour: req.body.eventStartHour,
        eventEndHour: req.body.eventEndHour,
        eventDuration: req.body.eventDuration,
        eventLocation: req.body.eventLocation,
        nbrParticipants: req.body.nbrParticipants,
        eventCategory: req.body.eventCategory,
        eventIsPublic: req.body.eventIsPublic,
        eventIsDeleted: false,
        //     participantsId: req.body.participantsId,
        //     eventIsOver: req.body.eventIsOver,
    });
    event
        .save()
        .then(result => {
            res.status(200).json({
                results: true,
                Event: result
            })
        })
        .catch(err => {
            utils.defaultError(res, err)
        });
};

exports.put_eventByUserId = (req, res, next) => {   
    eventService.putEventByUserId(req, res)
}

exports.getEvntByUserIdAndCommunityId = (req, res, next) => {
    let communityId = req.params.communityId;
    let eventCreator = req.params.userId;

    Event.find({
            eventCommunity: communityId,
            eventCreator: eventCreator,
            eventIsDeleted: false,
            eventIsOver: false,
        })
        .exec()
        .then(events => {
            if (events.length === 0) {
                return res.status(200).json({
                    code: "404",
                    message: "There are no events!"
                })
            } else {
                res.status(200).json({
                    Count: events.length,
                    Events: events
                });
            }
        })
        .catch(err => {
            utils.defaultError(res, err)
        })

}


exports.eventByCommunityId = (req, res, next) => {
    let eventId = req.params.eventId;
    let communityId = req.params.communityId;

    Event.find({
            eventCommunity: communityId,
            eventId: eventId,
        })
        .exec()
        .then(events => {
            if (events.length === 0) {
                return res.status(404).json({
                    message: "There are no events!"
                })
            } else {
                res.status(200).json({
                    Count: events.length,
                    Events: events
                });
            }
        })
        .catch(err => {
            utils.defaultError(res, err)
        })

}


exports.get_event_by_community = (req, res, next) => {
    const id = req.params.eventCommunity;
    Event.find({
            eventCommunity: id
        })
        .exec()
        .then(evt => {
            if (evt.length === 0) {
                return res.status(404).json({
                    message: "event by eventCommunity not found or id not valid!"
                })
            } else {
                res.status(200).json({
                    Event: evt,
                    request: {
                        type: "[GET4]",
                        url: process.env.URL_BACKEND + ":" + process.env.URL_BACKEND_PORT + "/events"
                    }
                });
            }
        })
        .catch(err => {
            utils.defaultError(res, err)
        });
};

exports.deleteEventByCommunityId = (req, res, next) => {
    let eventId = req.params.eventId;
    let communityId = req.params.communityId;

    Event.find({
            eventId: eventId,
            eventCommunity: communityId
        }).exec()
        .then(event => {
            Event.findByIdAndUpdate(event[0]['_id'],
                req.body, {
                    new: false,
                },
                function (err, results) {
                    if (err) return res.status(500).json(err);
                    res.status(200).json({
                        message: "success"
                    })
                });
        })
        .catch(err => {
            utils.defaultError(res, err)
        });
}

exports.get_event_by_id = (req, res, next) => {
    const id = req.params.eventId;
    Event.find({
            eventId: id
        })
        .exec()
        .then(evt => {
            if (evt.length === 0) {
                return res.status(404).json({
                    message: "event by eventId not found or id not valid!"
                })
            } else {
                res.status(200).json({
                    Event: evt,
                    request: {
                        type: "[GET5]",
                        url: process.env.URL_BACKEND + ":" + process.env.URL_BACKEND_PORT + "/events"
                    }
                });
            }
        })
        .catch(err => {
            utils.defaultError(res, err)
        });
};


// TODO - events should be filtered by end date not start date.

exports.put_all_events_isOver = (req, res, next) => {
    let userId = req.params.userId;
    let communityId = req.params.communityId;

    // Update the users events list
    User.find({
            userId: userId,
            "profile.profileCummunityId": communityId
        }).exec()
        .then(user => {
            Event.find({
                    eventIsOver: false,
                    eventIsDeleted: false,
                })
                .exec()
                .then(activeEvent => {
                    if (activeEvent.length === 0) {
                        return res.status(200).json({
                            code: "42",
                            message: "There are no due events!"
                        })
                    } else {
                        let i = 0;
                        let listEventIsOver = [];
                        let currentDat = new Date;
                        activeEvent.map(event => {
                            if (event.eventStartDate < currentDat) {
                                event.eventIsOver = true;
                                Event.findByIdAndUpdate(event._id,
                                    event, {
                                        new: false,
                                    },
                                    function (err, results) {
                                        if (err) return res.status(500).json(err);
                                        console.log("EVENT IS OVER")
                                    });
                                if (user[0].eventsParticipated.length > 0) {
                                    while (i < user[0].eventsParticipated.length) {
                                        if (user[0].eventsParticipated[i] != null && user[0].eventsParticipated[i].eventId == event.eventId) {
                                            listEventIsOver.push(user[0].eventsParticipated[i]);
                                        }
                                        i++;
                                    }
                                }
                                i = 0;
                            }
                        })
                        if (listEventIsOver.length > 0) {
                            let list = [];
                            list = utils.popEventObjectFromUser(listEventIsOver, user[0].eventsParticipated);
                            user[0].eventsParticipated = list
                            User.findByIdAndUpdate(user[0]._id,
                                user[0], {
                                    new: false,
                                },
                                function (err, results) {
                                    if (err) return res.status(500).json(err);
                                    console.log("USER IS UPDATED")
                                });
                            res.send({
                                "User updated  : ": "User updated !"
                            });
                        } else {
                            res.send({
                                "User updated  : ": "User up to date !"
                            });
                        }
                    }
                })
                .catch(err => {
                    utils.defaultError(res, err)
                })
        })


}