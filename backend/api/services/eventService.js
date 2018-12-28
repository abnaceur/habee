exports.updateEcevntIsOver = (event) => {
    let currentDate = new Date;

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