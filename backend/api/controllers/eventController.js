const express = require('express');
const Event = require('../models/event');
const User = require('../models/user');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const utils = require('../services/utils');
const eventService = require('../services/eventService');
const eventCommentService = require('../services/eventServices/eventCommentsService');
const deletEvent = require('../services/eventServices/deleteEvent')
const addEventService = require('../services/eventServices/addEventService')
const eventFilterService = require("../services/eventServices/getFiltersService")
const updateFilterService = require("../services/eventServices/updateFiltersService")
const listEVentByUserService = require("../services/userServices/listProposedEventsServie");
const searchEventService = require("../services/eventServices/searchEventService");

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

    updateFilterService.updateFilterOptions(req, res, userId)
}

exports.getEventFilter = (req, res, next) => {
    let userId = req.params.userId;

    eventFilterService.getFilterOptions(res, userId)
}

exports.getFilteredEvent = (req, res, next) => {
    let userId = req.params.userId;
    let communityId = req.params.communityId;
    let page = req.params.page;

    eventService.filterEvent(req, res, userId, communityId, page);
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
    let imagePath = utils.getImagePath(req, req.body.eventPhoto);

    addEventService.addNewEvent(res, req, imagePath)
};

exports.put_eventByUserId = (req, res, next) => {
    eventService.putEventByUserId(req, res)
}

exports.getEvntByUserIdAndCommunityId = (req, res, next) => {
    let page = req.params.page;
    let eventCreator = req.params.userId;

    listEVentByUserService.listProposedEventByUserId(res, page, eventCreator)
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

    deletEvent.deleteThisEvent(eventId, communityId, req, res)
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


exports.getCommentByEventId = (req, res, next) => {
    let eventId = req.params.eventId;
    let communityId = req.params.communityId;

    eventCommentService.getCommentsByEventId(res, req, eventId, communityId)
}



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

exports.searchEventByInput = (req, res, next) => {
    let text = req.body;
    let userId = req.params.userId;
    let page = req.params.page;

    searchEventService.searchEventByInput(text, userId, res, page)
}