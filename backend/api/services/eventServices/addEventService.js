const Event = require('../../models/event')
const eventClass = require('../../classes/eventClass')
const utils = require('../utils')
const eventCommentService = require('../eventServices/eventCommentsService')

getCategoryPicture = (imagePath, eventCategory, eventName) => {
    let title = eventName.toLowerCase();

    return new Promise((resolve, rejejct) => {
        if (eventCategory == "Sports") {
            if (title == "soccer" || title == "foot" || title == "football") {
                let ran = Math.floor(Math.random() * 2) + 1;
                imagePath = "uploads/foot_" + ran + ".png";
            } else if (title == "bike" || title == "moto") {
                //let ran = Math.floor(Math.random() * 1) + 1;
                imagePath = "uploads/bike_1" + ".png";
            } else if (title == "boxe" || title == "boxing") {
                //let ran = Math.floor(Math.random() * 1) + 1;
                imagePath = "uploads/boxe_1" + ".png";
            } else if (title == "judo") {
                //let ran = Math.floor(Math.random() * 1) + 1;
                imagePath = "uploads/judo_1" + ".png";
            } else if (title == "roller") {
                //let ran = Math.floor(Math.random() * 1) + 1;
                imagePath = "uploads/roller_1" + ".png";
            } else if (title == "running" || title == "jogging") {
                //let ran = Math.floor(Math.random() * 1) + 1;
                imagePath = "uploads/running_1" + ".png";
            } else if (title == "skate" || title == "skate board") {
                //let ran = Math.floor(Math.random() * 1) + 1;
                imagePath = "uploads/skate_1" + ".png";
            }
        } else if (eventCategory == "Fete") {
            if (title == "soiree" || title == "fete" || title == "partu") {
                //let ran = Math.floor(Math.random() * 1) + 1;
                imagePath = "uploads/soiree_1" + ".png";
            }
        } else {
            imagePath = "uploads/defaultsEvent.png"
        }
        // else if (eventCategory == "Arts") {

        // }
        // else if (eventCategory == "Culture") {}
        // else if (eventCategory == "Media") {}
        // else if (eventCategory == "Music") {}
        // else if (eventCategory == "Social") {}
        // else if (eventCategory == "International") {}
        // else if (eventCategory == "Business") {}
        // else if (eventCategory == "Communite") {}
        // else if (eventCategory == "Sante") {}
        // else if (eventCategory == "Science et technologie") {}
        // else if (eventCategory == "Style de vie") {}
        // else if (eventCategory == "Rencontre") {}
        // else if (eventCategory == "Workshop") {}


        resolve(imagePath);
    })
}

saveEvent = (res, req, imagePath) => {
    const event = new Event(eventClass.initEvent(req, imagePath));
    event
        .save()
        .then(result => {
            eventCommentService.createCommentsForEvent(req.body.eventId, req.body.eventCommunity)
            res.status(200).json({
                results: true,
                Event: result
            })
        })
        .catch(err => {
            utils.defaultError(res, err)
        });
}

addNewEvent = (res, req, imagePath) => {

    if (imagePath == "uploads/defaultEventImage.jpeg") {
        getCategoryPicture(imagePath, req.body.eventCategory, req.body.eventName)
            .then(imagePath => {
                saveEvent(res, req, imagePath)
            })
    } else
        saveEvent(res, req, imagePath)
}

module.exports = {
    addNewEvent,
    saveEvent,
    getCategoryPicture
}