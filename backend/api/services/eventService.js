const Event = require('../models/event');



exports.updateEcevntIsOver = (event) => {
    let currentDate = new Date;

    let i = currentDate.toISOString().slice(0, 10) + "T00:59:18.132Z";

    let currentMdate = new Date(i);

    let formatTime = "T" + event.eventEndHour.substring(0, 2) + ":" + event.eventEndHour.substring(3, 5) + ":00.000Z"
    let endDate = event.eventEndDate.toISOString().slice(0, 10) + formatTime

    let formatedEndDate = new Date(endDate)

    if (formatedEndDate <= currentMdate) {
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

exports.eventModal = (event) => {
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

exports.getAllpublicEvents = () => {
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