const express = require('express');
const router = express.Router();
const Event = require('../models/event');
const mongoose = require('mongoose');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        // Rename the uplaoded file
        cb(null, new Date().toISOString() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    // Define the extension of the file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png')
        cb(null, true);
    else
        cb(null, false);
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});


/*
 * API [GET] for route /events
 */

router.get('/', (req, res, next) => {
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
});


/**
 * API [POST] for route /events
 */


router.post('/', upload.any(), (req, res, next) => {
    const event = new Event({
        _id: new mongoose.Types.ObjectId,
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
});


/**
 * API [GET] foor route /events/community/eventCommunity
 */

router.get('/community/:eventCommunity', (req, res, next) => {
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
});


/**
 * API [GET] foor route /events/eventId
 */

router.get('/:eventId', (req, res, next) => {
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
});


/**
 *  API [PATCH] for route /events/eventId
 */


router.patch('/:eventId', upload.any(), (req, res, next) => {
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
});


/*
 ** API route [GET] for /events/all/isOver
 */

router.get('/all/isover', (req, res, next) => {
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
});


/*
 ** API route [GET] for /events/all/isNotOver
 */

router.get('/all/isnotover', (req, res, next) => {
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
});


/*
 ** API [GET] for route /events/community/communityId
 */

router.get('/community/:eventCommunity', (req, res, next) => {
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
});


/*
 ** API [GET] for route /events/communityId/isOver   
 */

router.get('/:eventCommunity/isover', (req, res, next) => {
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
});


/*
 ** API [PATC] for route /events/communityId/isOver   
 */

router.patch('/:eventCommunity/isover', (req, res, next) => {
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
});



/*
 ** API [GET] for route /events/communityId/isNotOver   
 */

router.get('/:eventCommunity/isnotover', (req, res, next) => {
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
});


/*
 ** API [PATC] for route /events/communityId/isNotOver   
 */

router.patch('/:eventCommunity/isnotover', (req, res, next) => {
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
});




module.exports = router;