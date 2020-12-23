const Event = require('../../models/event');
const utils = require('../utils');
const User = require('../../models/user');
const deleteEventEmail = require('../../services/emailServices/deleteEventEmailService')

//TODO EVENT DELTE EMAIL
//TODO REMOVE COMMUNITY FROM EVENT
notifyParticipants = (event) => {
    let participants = event.participants;

    return new Promise((resolve, reject) => {
        participants.map(participant => {
            //  let msg = deleteEventEmail.deleteEvent(participant, event)
            let userId = participant.participantId;
            User.find({
                    userId: userId
                }).select("credentials.email")
                .exec()
                .then(userEmail => {
                    let data = event.eventStartDate.substring(8, 10) + "." + event.eventStartDate.substring(5, 7) + "." + event.eventStartDate.substring(0, 4) + " à " + event.eventStartHour;
                    deleteEventEmail.delEventEmail(userEmail[0].credentials.email, "Événement annulé",
                        participant.participantname, data, event.eventName)
                    // utils.sendEmail("Habee TEAM", userEmail[0].credentials.email, "événement annule", msg);
                    resolve(200)
                })
        })
    })
}

deleteThisEvent = (eventId, communityId, req, res) => {
    Event.find({
            eventId: eventId,
            eventCreator: req.body.eventCreator,
            eventIsDeleted: false
        }).exec()
        .then(event => {
            if (req.body.check == 1) {
                event[0].eventIsDeleted = true;
                Event.findByIdAndUpdate(event[0]['_id'],
                    event[0], {
                        new: false,
                    },
                    function (err, results) {
                        if (err) return res.status(500).json(err);
                        console.log("DELETED")
                        if (req.body.participants.length > 0)
                            notifyParticipants(req.body)
                            .then(data => {
                                res.status(200).json({
                                    message: "success"
                                })
                            })
                        else {
                            res.status(200).json({
                                message: "success"
                            })
                        }

                    });
            } else if (req.body.check == 0) {
                Event.findByIdAndUpdate(req.body._id,
                    req.body, {
                        new: false,
                    },
                    function (err, results) {
                        if (err) return res.status(500).json(err);
                        console.log("EDITED", results)
                        res.status(200).json({
                            message: "success"
                        })
                    });
            }
        })
        .catch(err => {
            utils.defaultError(res, err)
        });
}

module.exports = {
    deleteThisEvent,
    notifyParticipants
}