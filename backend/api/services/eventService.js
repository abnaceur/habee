const Event = require('../models/event');
const utils = require('./utils');
const User = require('../models/user');
const Community = require("../models/community")


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

getProfilePosition = (profiles, communtyId) => {
    let pos = 0;
    let i = 0

    profiles.map(pr => {
        if (pr.profileCummunityId === communtyId)
            pos = i;
        i++;
    })

    return pos
}

exports.initBodyReq = (check, req, user, event, communityId) => {

    if (check != 1) {
        req.body.participants = event[0].participants;
        req.body.nbrSubscribedParticipants = event[0].participants.length;
        req.body.participants.push({
            "participantId": user[0].userId,
            "participantname": user[0].profile.profileLastname + " " + user[0].profile.profileFirstname,
            "participantPhoto": user[0].profile.profilePhoto,
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
            req = this.initBodyReq(check, req, user, event, communityId);
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
    }).exec()
        .then(user => {
            Event.find({
                eventId: eventId,
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


filterWithPublicTrue = (pageTem, res, activeEvent, filter, userId, pageTmp) => {
    utils.filterEvents(activeEvent, filter, userId)
        .then(filteredEvent => {
            Event.find({
                eventCreator: userId,
                eventIsOver: false,
                eventIsDeleted: false,
            })
                .sort('eventStartDate')
                .skip(Number(pageTmp * 10))
                .limit(Number(10))
                .exec()
                .then(evs => {
                    res.status(200).json({
                        Count: filteredEvent.length,
                        per_page: 10,
                        total: filteredEvent.length,
                        total_pages: Math.floor(evs.length / 10),
                        Events: filteredEvent.map(event => {
                            return eventModal(event)
                        })
                    });
                })
                .catch()
        })
}

returnNoevent = (res) => {
    return res.status(200).json({
        message: "There are no events!",
        Events: []
    })
}

updateCommunityEvents = (pageTmp, alluserCom, communityId, res, filter, activeEvent, userId) => {

    if (activeEvent.length === 0 && filter[0].value === true) filterWithPublicTrue(pageTmp, res, activeEvent, filter, userId, pageTmp)
    else {
        if (activeEvent.length === 0)
            activeEvent.map(event => {
                updateEventIsOver(event)
            })
        Event.find({
            eventCreator: userId,
            eventCommunity: {
                "$in": alluserCom
            },
            eventIsOver: false,
            eventIsDeleted: false,
        })
            .sort('eventStartDate')
            .skip(Number(pageTmp * 10))
            .limit(Number(10))
            .exec()
            .then(events => {
                activeEvent = activeEvent.concat(events)

                if (activeEvent.length === 0) returnNoevent(res);
                else filterWithPublicTrue(pageTmp, res, activeEvent, filter, userId, pageTmp)
            })
            .catch(err => {
                utils.defaultError(res, err)
            })
    }

}

getCommunityMemberByParticipation = (userId) => {
    return new Promise((resolve, reject) => {
        Community.find({
            communityMembers: {
                "$in": [userId]
            },
            communityIsDeleted: false
        }).exec()
            .then(comPart => {
                resolve(comPart)
            })
            .catch(err => console.log("Error :", err))
    })
}

AlluserCommunity = (userId) => {
    return new Promise((resolve, reject) => {
        Community.find({
            communityCreator: userId,
            communityIsDeleted: false
        }).exec()
            .then(comCreated => {
                getCommunityMemberByParticipation(userId)
                    .then(comByPart => {
                        let memebers = [];
                        comCreated.map(cc => {
                            memebers = memebers.concat(cc.communityId)
                        })
                        comByPart.map(cc => {
                            memebers = memebers.concat(cc.communityId)
                        })
                        let uniqMembers = [...new Set(memebers)];
                        resolve(uniqMembers)

                    }).catch(err => console.log("Err", err))
            })
            .catch(err => utils.defaultError(res, err))
    })
}

async function getAllcomsIds(comFilters) {
    let comIds = [];

    return new Promise((resolve, reject) => {
        comFilters.map(flt => {
            if (flt.value === true)
                comIds.push(flt.communityId)
        })
        resolve(comIds);
    })

}

async function filterEvent(req, res, userId, communityId, page) {
    let pageTmp = 0

    if (page != undefined)
        pageTmp = page;

    AlluserCommunity(userId)
        .then(alluserCom => {
            User.find({
                userId: userId,
            })
                .exec()
                .then(async (usr) => {
                    let filter = usr[0].filterEvent;
                    let comsIds = await getAllcomsIds(usr[0].communitiesFilter)
                    Event.find({
                        eventCommunity: {
                            "$in": comsIds
                        },
                        eventCreator: {
                            "$ne": userId
                        },
                        eventIsOver: false,
                        eventIsDeleted: false,
                    })
                        .sort('eventStartDate')
                        .skip(Number(pageTmp * 10))
                        .limit(Number(10))
                        .exec()
                        .then(activeEvent => updateCommunityEvents(pageTmp, comsIds, communityId, res, filter, activeEvent, userId, pageTmp))
                        .catch(err => utils.defaultError(res, err))
                }).catch(err => utils.defaultError(res, err))
        })
}


module.exports = {
    AlluserCommunity,
    getCommunityMemberByParticipation,
    filterEvent,
    getProfilePosition,
    getAllpublicEvents,
    eventModal,
    updateEventIsOver,
    updateUserOnEventSubvscription,
    putEventByUserId,
    getAllcomsIds
}