const Event = require('../models/event');
const utils = require('./utils');
const User = require('../models/user');



exports.formatDate = (event) => {
    const currentDate = new Date;
    const i = currentDate.toISOString().slice(0, 10) + "T00:59:18.132Z";
    const currentMdate = new Date(i);
    const formatTime = "T" + event.eventEndHour.substring(0, 2) + ":" + event.eventEndHour.substring(3, 5) + ":00.000Z"
    const endDate = event.eventEndDate.toISOString().slice(0, 10) + formatTime
    const formatedEndDate = new Date(endDate)

    return ({
        formatedEndDate,
        currentMdate
    });
}

updateEventIsOver = (event) => {
    let formatedEndDate = this.formatDate(event).formatedEndDate;
    let currentDate = this.formatDate(event).currentMdate;

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

eventModal = (event) => {
    let test = {
        _id: event._id,
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
        eventCategory: event.eventCategory,
        request: {
            Type: "[GET]",
            Url: process.env.URL_BACKEND + ":" + process.env.URL_BACKEND_PORT + "/" + event.eventId
        }
    }

    return test
}

getAllpublicEvents = () => {
    return new Promise((resolve, reject) => {
        Event.find({
                eventIsPublic: true,
                eventIsDeleted: false,
                eventIsOver: false
            }).exec()
            .then(event => {
                resolve(event)
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
        }).catch(err => {
            utils.defaultError(res, err)
        })
}

exports.updateEvent = (userData, check) => {
    Event.findByIdAndUpdate(userData.event[0]._id,
        userData.req.body, {
            new: false,
        },
        function (err, results) {
            if (err) return userData.res.status(500).json(err);
            if (check == 0) {
                this.updateUserOnEventSubvscription(userData.event, check, userData.userId, userData.communityId);
                userData.res.status(200).json({
                    Subscribe: true,
                    results: results,
                })
            } else {
                utils.popObject(userData.user[0].eventsParticipated, userData.event[0].eventId);
                this.updateUserOnEventSubvscription(userData.event, check, userData.userId, userData.communityId);
                userData.res.status(200).json({
                    Subscribe: false,
                    results: results,
                })
            }
        });
}

getProfilePosition = (user, communtyId) => {
    let pos = 0;
    let i = 0
    user.profile.map(pr => {
        if (pr.profileCummunityId == communtyId)
            pos = i;
        i++;
    })

    return pos
}

exports.initBodyReq = (check, req, user, event) => {
    let pos = getProfilePosition(user[0], event[0].eventCommunity)
    
    if (check != 1) {
        req.body.participants = event[0].participants;
        req.body.nbrSubscribedParticipants = event[0].participants.length;
        req.body.participants.push({
            "participantId": user[0].userId,
            "participantname": user[0].profile[pos].profileUsername,
            "participantPhoto": user[0].profile[pos].profilePhoto,
        })
    } else {
        req.body.nbrSubscribedParticipants = event[0].participants.length;
        req.body.participants = event[0].participants;
    }

    return req;
}


exports.updatWithinPutEventByUserId = (userData_org) => {
    let event = userData_org.event;
    let req = userData_org.req;
    let res = userData_org.res;
    let user = userData_org.user;
    let communityId = userData_org.communityId;
    let userId = userData_org.userId;

    getAllpublicEvents()
        .then(ev => {
            event = utils.concatArraysUser(event, ev)
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
            req = this.initBodyReq(check, req, user, event);
            let userData = {
                event,
                userId,
                communityId,
                req,
                res,
                user
            }
            this.updateEvent(userData, check)
        })
        .catch(err => {
            utils.defaultError(res, err)
        })
}

putEventByUserId = (req, res) => {
    let eventId = req.params.eventId;
    let userId = req.params.userId;
    let communityId = req.params.communityId;

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
                    let userData_org = {
                        event,
                        userId,
                        communityId,
                        req,
                        res,
                        user
                    }
                    this.updatWithinPutEventByUserId(userData_org);
                })
                .catch(err => {
                    utils.defaultError(res, err)
                })
        })
        .catch(err => {
            utils.defaultError(res, err)
        })
}


filterWithPublicTrue = (res, activeEvent, filter, userId) => {
    utils.filterEvents(activeEvent, filter, userId)
        .then(filteredEvent => {
            res.status(200).json({
                Count: filteredEvent.length,
                Events: filteredEvent.map(event => {
                    return eventModal(event)
                })
            });
        })
}

returnNoevent = (res) => {
    return res.status(200).json({
        message: "There are no events!"
    })
}

updateCommunityEvents = (communityId, res, filter, activeEvent, userId) => {
    if (activeEvent.length === 0 && filter.PublicValue === true) filterWithPublicTrue(res, activeEvent, filter, userId)
    else if (activeEvent.length === 0) returnNoevent(res);
    else {
        activeEvent.map(event => {
            updateEventIsOver(event)
        })
        Event.find({
                eventCommunity: communityId,
                eventIsOver: false,
                eventIsDeleted: false,
            })
            .exec()
            .then(events => {
                if (events.length === 0) returnNoevent(res);
                else filterWithPublicTrue(res, activeEvent, filter, userId)
            })
            .catch(err => {
                utils.defaultError(res, err)
            })
    }

}


filterEvent = (req, res, userId, communityId) => {
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
                .then(activeEvent => updateCommunityEvents(communityId, res, filter, activeEvent, userId))
                .catch(err => utils.defaultError(res, err))
        }).catch(err => utils.defaultError(res, err))
}

module.exports = {
    filterEvent,
    getProfilePosition,
    getAllpublicEvents,
    eventModal,
    updateEventIsOver,
    updateUserOnEventSubvscription,
    putEventByUserId
}