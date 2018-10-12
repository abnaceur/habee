const express = require('express');
const Event = require('../models/event');
const mongoose = require('mongoose');
const jwt = require ('jsonwebtoken');

exports.get_all_events =  (req, res, next) => {
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

exports.get_all_events_byCommunityId =  (req, res, next) => {
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
                            eventDate: event.eventDate,
                            eventDuration: event.eventDuration,
                            eventLocation: event.eventLocation,
                            nbrParticipants: event.nbrParticipants,
                            participantsId: event.participantsId,
                            eventIsOver: event.eventIsOver,
                            eventPhoto: event.eventsPhoto,
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
        eventsPhoto: req.files == undefined ? "uplaods/": req.files[0].path,
        eventCreator: req.body.eventCreator,
        eventDescription: req.body.eventDescription,
        eventDate: req.body.eventDate,
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

exports.eventByCommunityId = (req, res, next) => {
    let eventId = req.params.eventId;
    let communityId = req.params.communityId;

    Event.find({
        eventCommunity: communityId,
        eventId:    eventId,
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
                            participantsId: event.participantsId,
                            eventIsOver: event.eventIsOver,
                            eventPhoto: event.eventsPhoto,
                            eventIsDeleted: event.eventIsDeleted,
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
                        type: "[GET]",
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
                            participantsId: event.participantsId,
                            eventIsOver: event.eventIsOver,
                            eventIsDeleted: event.eventIsDeleted,
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
            req.body, 
            {
                new : false,  
            }, function (err, results) {
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
                        type: "[GET]",
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