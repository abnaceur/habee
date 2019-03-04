const Event = require('../../models/event');
const utils = require('../utils');
const User = require('../../models/user');
const deleteEventEmail = require('../../emailsTemplate/eventEmails')

notifyParticipants = (event) => {
    let participants = event.participants;

    return new Promise((resolve, reject) => {
        participants.map(participant => {
            let msg = deleteEventEmail.deleteEvent(participant, event)
            let userId = participant.participantId;
            User.find({
                    userId: userId
                }).select("credentials.email")
                .exec()
                .then(userEmail => {
                    utils.sendEmail("Habee TEAM", userEmail[0].credentials.email, "Evenement annuler", msg);
                    resolve(200)
                })
        })
    })
}

deleteThisEvent = (eventId, communityId, req, res) => {
    console.log("Req event : ", req.body, req.body.participants.length)
    Event.find({
            eventId: eventId,
            eventCommunity: communityId
        }).exec()
        .then(event => {
            Event.findByIdAndUpdate(event[0]['_id'],
                req.body, {
                    new: false,
                },
                function (err, results) {
                    if (err) return res.status(500).json(err);
                    if (req.body.check == 1) {
                        if (req.body.participants.length     > 0)
                            notifyParticipants(req.body)
                            .then(data => {
                                res.status(200).json({
                                    message: "success"
                                })
                            })
                    }
                });
        })
        .catch(err => {
            utils.defaultError(res, err)
        });
}

module.exports = {
    deleteThisEvent,
    notifyParticipants
}