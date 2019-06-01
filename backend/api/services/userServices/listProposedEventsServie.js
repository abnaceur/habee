const utils = require('../utils');
const Event = require('../../models/event');

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

async function getAllEvents(res) {
    return new Promise((resolve, reject, eventCreatorId) => {
        Event.find({
            eventCreator: eventCreatorId,
            eventIsDeleted: false,
            eventIsOver: false,
        })
            .exec()
            .then(events => {
                resolve(events)
            })
            .catch(err => utils.defaultError(res, err))
    })
}

async function listProposedEventByUserId(res, page, eventCreatorId) {
    let pageTmp = 0
    let Allevents = [];

    if (page != undefined)
        pageTmp = page;


    Allevents = await getAllEvents(res, eventCreatorId);


    Event.find({
        eventCreator: eventCreatorId,
        eventIsDeleted: false,
        eventIsOver: false,
    })
        .sort('eventStartDate')
        .skip(Number(pageTmp * 10))
        .limit(Number(10))
        .exec()
        .then(events => {
            if (events.length === 0) {
                return res.status(200).json({
                    code: "404",
                    message: "There are no events!"
                })
            } else {
                res.status(200).json({
                    Count: Allevents.length,
                    per_page: 10,
                    total: Allevents.length,
                    total_pages: Math.floor(events.length / 10),
                    Events: events.map(event => {
                        return eventModal(event)
                    })
                });
            }
        })
        .catch(err => {
            utils.defaultError(res, err)
        })
}

module.exports = {
    eventModal,
    listProposedEventByUserId,
    getAllEvents
}