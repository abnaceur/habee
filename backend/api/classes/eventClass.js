const mongoose = require('mongoose');

class EventClass {
    constructor() {
        this.event = {}
    }

    initEvent(req) {
        this.event = {
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

        return this.event
    }
}

module.exports = {
    EventClass
}