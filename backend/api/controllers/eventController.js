const express = require('express');
const Event = require('../models/event');
const User = require('../models/user');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const utils = require('../services/utils');

exports.get_all_events = (req, res, next) => {
    Event.find()
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
                        return {
                            _id: events._id,
                            eventId: event.eventId,
                            eventCommunity: event.eventCommunity,
                            eventName: event.eventName,
                            eventCreator: event.eventCreator,
                            eventDescription: event.eventDescription,
                            eventDate: event.eventDate,
                            eventDuration: event.eventDuration,
                            eventLocation: event.eventLocation,
                            nbrParticipants: event.nbrParticipants,
                            participantsId: event.participantsId,
                            eventIsOver: event.eventIsOver,
                            eventPhoto: event.eventsPhoto,
                            request: {
                                Type: "[GET2]",
                                Url: process.env.URL_BACKEND + ":" + process.env.URL_BACKEND_PORT + "/" + event.eventId
                            }
                        }
                    })
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
};

exports.get_userEventSubscribed = (req, res, next) => {
    let eventId = req.params.eventId;
    let userId = req.params.userId;
    let communityId = req.params.communityId;

    Event.find({
        eventId: eventId,
        eventCommunity: communityId,
        "participants.participantId" : userId,
    }).exec()
    .then(event => {
        console.log("Count event users :", event[0].participants);
        res.status(200).json({
            event: event
        })
    }).catch(err => {
        res.status(500).json({
            error: err
        })
    })

}

exports.get_all_events_byCommunityId = (req, res, next) => {
    let communityId = req.params.communityId;

    Event.find({
            eventCommunity: communityId,
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
                        return {
                            _id: events._id,
                            eventId: event.eventId,
                            eventCommunity: event.eventCommunity,
                            eventName: event.eventName,
                            eventCreator: event.eventCreator,
                            eventDescription: event.eventDescription,
                            eventStartDate: event.eventStartDate,
                            eventEndDate: event.eventEndDate,
                            eventStartHour: event.eventStartHour,
                            eventEndHour: event.eventEndHour,
                            eventLocation: event.eventLocation,
                            nbrParticipants: event.nbrParticipants,
                            participants: event.participants,
                            nbrSubscribedParticipants: event.participants.length,
                            eventIsOver: event.eventIsOver,
                            eventPhoto: event.eventPhoto,
                            request: {
                                Type: "[GET]",
                                Url: process.env.URL_BACKEND + ":" + process.env.URL_BACKEND_PORT + "/" + event.eventId
                            }
                        }
                    })
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
};

exports.post_event = (req, res, next) => {
    console.log("Evenet photo : ", req.files[0].path);
    const event = new Event({
        _id: new mongoose.Types.ObjectId,
        eventId: req.body.eventId,
        eventCommunity: req.body.eventCommunity,
        eventName: req.body.eventName,
        eventPhoto: req.files == undefined ? "uplaods/" : req.files[0].path,
        eventCreator: req.body.eventCreator,
        eventDescription: req.body.eventDescription,
        eventStartDate: req.body.eventStartDate,
        eventEndDate: req.body.eventEndDate,
        eventStartHour: req.body.eventStartHour,
        eventEndHour: req.body.eventEndHour,
        eventDuration: req.body.eventDuration,
        eventLocation: req.body.eventLocation,
        nbrParticipants: req.body.nbrParticipants,
        eventIsDeleted: false,
        //     participantsId: req.body.participantsId,
        //     eventIsOver: req.body.eventIsOver,
    });
    event
        .save()
        .then(result => {
            res.status(200).json({
                Success: "true",
                Event: result
            })
        })
        .catch(err => {
            res.status(500).json({
                Error: err
            })
        });
};

exports.put_eventByUserId = (req, res, next) => {
    let eventId = req.params.eventId;
    let userId = req.params.userId;
    let communityId = req.params.communityId;
    console.log("Event Ud :", eventId);
    User.find({
            userId: userId,
            "profile.profileCummunityId": communityId
        }).exec()
        .then(user => {
            Event.find({
                    eventId: eventId,
                    eventCommunity: communityId
                }).exec()
                .then(event => {
                    console.log("count 111: ", event)
                    let i = 0;
                    let check = 0;
                    while (i < event[0].participants.length) {
                        if (event[0].participants[i] != null) {
                            if (event[0].participants[i] != null && event[0].participants[i].participantId == user[0].userId) {
                                event[0].participants = utils.popEventObject(event[0].participants, user[0].userId);
                                check = 1;
                            }
                        }
                        i++;
                    }
                    if (check != 1) {
                        req.body.participants = event[0].participants;
                        req.body.nbrSubscribedParticipants = event[0].participants.length;
                        req.body.participants.push({
                            "participantId": user[0].userId,
                            "participantname": user[0].profile[0].profileUsername,
                            "participantPhoto": user[0].profile[0].profilePhoto,
                        })
                    } else {
                        req.body.nbrSubscribedParticipants = event[0].participants.length;
                        req.body.participants = event[0].participants;
                    }
                    Event.findByIdAndUpdate(event[0]._id,
                        req.body, {
                            new: false,
                        },
                        function (err, results) {
                            if (err) return res.status(500).json(err);
                            if (check == 0) {
                                //console.log("User sub :", event);
                                updateUserOnEventSubvscription(event, check, userId, communityId);
                                res.status(200).json({
                                    Subscribe: true,
                                    results: results,
                                })
                            } else {
                                console.log("User unsub :", event);
                                utils.popObject(user[0].eventsParticipated, event[0].eventId);
                                updateUserOnEventSubvscription(event, check, userId, communityId);
                                res.status(200).json({
                                    Subscribe: false,
                                    results: results,
                                })
                            }
                        });
                })
                .catch(err => {
                    res.status(500).json({
                        error: err
                    })
                })

        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}

updateUserOnEventSubvscription = (event, state, userId, communityId) => {

    User.find({
        userId: userId,
        "profile.profileCummunityId": communityId
    }).exec()
    .then(user => {
        if (state == 0) {
            user[0].eventsParticipated.push(event[0])
            User.findByIdAndUpdate(user[0]._id,
                user[0], {
                    new: false,
                },
                function (err, results) {
                    if (err) return res.status(500).json(err);
                        console.log("SUBSCRIBED")
                });
        } else if (state == 1) {
            user[0].eventsParticipated = utils.popObject(user[0].eventsParticipated, event[0].eventId);
            User.findByIdAndUpdate(user[0]._id,
                user[0], {
                    new: false,
                },
                function (err, results) {
                    if (err) return res.status(500).json(err);
                        console.log("UNSUBSCRIBED")
            });
        }
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
            res.status(500).json({
                error: err
            })
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
            console.log(err);
            res.status(500).json({
                Error: err
            });
        });
};

exports.get_event_by_communityId = (req, res, next) => {
    const id = req.params.eventCommunity;
    Event.find({
            eventCommunity: id
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
                        return {
                            _id: events._id,
                            eventId: event.eventId,
                            eventCommunity: event.eventCommunity,
                            eventName: event.eventName,
                            eventCreator: event.eventCreator,
                            eventDescription: event.eventDescription,
                            eventDate: event.eventDate,
                            eventDuration: event.eventDuration,
                            eventLocation: event.eventLocation,
                            nbrParticipants: event.nbrParticipants,
                            participants: event.participants,
                            eventIsOver: event.eventIsOver,
                            eventIsDeleted: event.eventIsDeleted,
                            request: {
                                Type: "[GET1]",
                                Url: process.env.URL_BACKEND + ":" + process.env.URL_BACKEND_PORT + "/" + event.eventId
                            }
                        }
                    })
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
};

exports.get_eventIsOver_by_communiyId = (req, res, next) => {
    const id = req.params.eventCommunity;
    Event.find({
            eventCommunity: id,
            eventIsOver: true
        })
        .exec()
        .then(activeEvent => {
            if (activeEvent.length === 0) {
                return res.status(404).json({
                    message: "There are no active events in community!" + eventCommunity
                })
            } else {
                res.status(200).json({
                    Evennts: activeEvent
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
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
                    res.send(results);
                });
        })
        .catch(err => {
            res.status(500).json({
                Error: err
            })
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
            console.log(err);
            res.status(500).json({
                Error: err
            });
        });
};

exports.patch_event = (req, res, next) => {
    const id = req.params.eventId;

    Event.update({
            eventId: id
        }, {
            $set: {
                eventId: req.body.eventId,
                eventCommunity: req.body.eventCommunity,
                eventName: req.body.eventName,
                eventCreator: req.body.eventCreator,
                eventDescription: req.body.eventDescription,
                eventDate: req.body.eventDate,
                eventDuration: req.body.eventDuration,
                eventLocation: req.body.eventLocation,
                nbrParticipants: req.body.nbrParticipants,
                participantsId: req.body.participantsId,
                eventIsOver: req.body.eventIsOver,
            }
        })
        .exec()
        .then(results => {
            res.status(200).json({
                success: results
            })
        })
        .catch(err => {
            res.status(500).json({
                Error: err
            })
        });
};

exports.get_all_events_isOver = (req, res, next) => {
    Event.find({
            eventIsOver: true
        })
        .exec()
        .then(activeEvent => {
            if (activeEvent.length === 0) {
                return res.status(404).json({
                    message: "There are no due events!"
                })
            } else {
                res.status(200).json({
                    Evennts: activeEvent
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
};

exports.get_all_events_isNotOver = (req, res, next) => {
    Event.find({
            eventIsOver: false
        })
        .exec()
        .then(activeEvent => {
            if (activeEvent.length === 0) {
                return res.status(404).json({
                    message: "There are no active events!"
                })
            } else {
                res.status(200).json({
                    Evennts: activeEvent
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
};

exports.patch_eventIsOver_by_communiyId = (req, res, next) => {
    const id = req.params.eventCommunity;

    Event.update({
            eventCommunity: id,
            eventIsOver: true
        }, {
            $set: {
                eventId: req.body.eventId,
                eventCommunity: req.body.eventCommunity,
                eventName: req.body.eventName,
                eventCreator: req.body.eventCreator,
                eventDescription: req.body.eventDescription,
                eventDate: req.body.eventDate,
                eventDuration: req.body.eventDuration,
                eventLocation: req.body.eventLocation,
                nbrParticipants: req.body.nbrParticipants,
                participantsId: req.body.participantsId,
                eventIsOver: req.body.eventIsOver,
            }
        })
        .exec()
        .then(results => {
            res.status(200).json({
                success: results
            })
        })
        .catch(err => {
            res.status(500).json({
                Error: err
            })
        });
};

exports.get_eventIsNotOver_by_communiyId = (req, res, next) => {
    const id = req.params.eventCommunity;
    Event.find({
            eventCommunity: id,
            eventIsOver: false
        })
        .exec()
        .then(activeEvent => {
            if (activeEvent.length === 0) {
                return res.status(404).json({
                    message: "There are no active events in community!" + eventCommunity
                })
            } else {
                res.status(200).json({
                    Evennts: activeEvent
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
};

exports.patch_eventIsOver_by_communiyId = (req, res, next) => {
    const id = req.params.eventCommunity;

    Event.update({
            eventCommunity: id,
            eventIsOver: false
        }, {
            $set: {
                eventId: req.body.eventId,
                eventCommunity: req.body.eventCommunity,
                eventName: req.body.eventName,
                eventCreator: req.body.eventCreator,
                eventDescription: req.body.eventDescription,
                eventDate: req.body.eventDate,
                eventDuration: req.body.eventDuration,
                eventLocation: req.body.eventLocation,
                nbrParticipants: req.body.nbrParticipants,
                participantsId: req.body.participantsId,
                eventIsOver: req.body.eventIsOver,
            }
        })
        .exec()
        .then(results => {
            res.status(200).json({
                success: results
            })
        })
        .catch(err => {
            res.status(500).json({
                Error: err
            })
        });
};