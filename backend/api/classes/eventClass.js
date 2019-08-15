const mongoose = require('mongoose');

initEvent = (req, imagePath) => {
    let event = {
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
    }

    return event
}

eventAddComName = (event, communityName) => {
    let ev = {
        eventCommunityName: communityName,
        eventIsOver: false,
        eventIsDeleted: false,
        _id: event._id,
        eventId: event.eventId,
        eventCommunity: event.eventCommunity,
        eventName: event.eventName,
        eventPhoto: event.eventPhoto,
        eventCreator: event.eventCreator,
        eventDescription: event.eventDescription,
        eventStartDate: event.eventStartDate,
        eventEndDate: event.eventEndDate,
        eventStartHour: event.eventStartHour,
        eventEndHour: event.eventEndHour,
        eventLocation: event.eventLocation,
        nbrParticipants: event.nbrParticipants,
        eventCategory: event.eventCategory,
        eventIsPublic: event.eventIsPublic,
        dateOfCreation: event.dateOfCreation,
        dateOfLastUpdate: event.dateOfLastUpdate,
        participants: event.participants,
        nbrSubscribedParticipants: event.nbrSubscribedParticipants
    }

    return ev
}

module.exports = {
    initEvent,
    eventAddComName
}