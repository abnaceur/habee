
exports.defaultError = (res, err) => {
    return res.status(500).json({
        error: err
    })
}

exports.popObject = (obj, itemId) => {
    let i = 0;

    let newObj = [];
    while (i < obj.length) {
        if (obj[i] != null) {
            if (obj[i] != null && obj[i].eventId != itemId) {
                newObj.push(obj[i])
            }
        }
        i++;
    }

    return newObj;
}

exports.popEventObject = (obj, itemId) => {
    let i = 0;

    let newObj = [];
    while (i < obj.length) {
        if (obj[i] != null) {
            if (obj[i] != null && obj[i].participantId != itemId) {
                newObj.push(obj[i])
            }
        }
        i++;
    }
    return newObj;
}

exports.popEventObjectFromUser = (eventIsOver, eventParticiated) => {
    let i = 0;
    let j = 0;
    let check = 0;

    let newObj = [];
    while (i < eventParticiated.length) {
        while (j < eventIsOver.length) {
            if (eventParticiated[i].eventId === eventIsOver[j].eventId)
                check = 1;
            j++;
        }
        j = 0;
        if (check === 0) {
            newObj.push(eventParticiated[i])
        } else
            check = 0;
        i++;
    }
    return newObj;
}

exports.sendEmail = (from, to, subject, txt) => {
    var nodemailer = require('nodemailer');

    var transporter = nodemailer.createTransport({
        service: process.env.SERVICE,
        host: process.env.HOST,
        auth: {
            user: process.env.USER,
            pass: process.env.PASS
        }
    });
    var mailOptions = {
        from: from,
        to: to,
        subject: subject,
        text: txt
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log("error : ", error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}


exports.getFilterBycommunityId = (filter, communityId) => {
    let i = 0;
    let z = 0;

    filter.map(flt => {
        if (flt.filterCommunity == communityId)
            z = i;
        i++;
    })

    return filter[z];
}


exports.filterEvents = (events, filter) => {
    console.log("FILTER : ", filter);
    console.log("EVENTS : ", events);

    let activeFilters = [];
    let i = 0;
    let filteredEvent = [];
    let z = 0;


    if (filter.SportValue == true) {
        activeFilters[i] = "Sports";
        console.log("HERE")
        i++;
    }

    if (filter.ArtsValue == true) {
        activeFilters[i] = "Arts";
        i++;
    }

    if (filter.cultureValue == true) {
        activeFilters[i] = "Culture";
        i++;
    }

    if (filter.MediaValue == true) {
        activeFilters[i] = "Media";
        i++;
    }

    if (filter.musicValue == true) {
        activeFilters[i] = "Music";
        i++;
    }

    if (filter.socialValue == true) {
        activeFilters[i] = "Social";
        i++;
    }

    if (filter.internValue == true) {
        activeFilters[i] = "International";
        i++;
    }

    if (filter.businessValue == true) {
        activeFilters[i] = "Business";
        i++;
    }

    if (filter.communityValue == true) {
        activeFilters[i] = "Communite";
        i++;
    }
    if (filter.santeValue == true) {
        activeFilters[i] = "Sante";
        i++;
    }

    if (filter.itValue == true) {
        activeFilters[i] = "Science et technologie";
        i++;
    }

    if (filter.lifestyleValue == true) {
        activeFilters[i] = "Style de vie";
        i++;
    }

    if (filter.partyValue == true) {
        activeFilters[i] = "Fete";
        i++;
    }

    if (filter.meetingValue == true) {
        activeFilters[i] = "Rencontre";
        i++;
    }

    if (filter.WorkshopValue == true) {
        activeFilters[i] = "Workshop";
        i++;
    }

    if (i != 0) {
        console.log("ACTIVE FILTER : ", activeFilters)
        events.map(event => {
            while (z < i) {
                if (event.eventCategory == activeFilters[z]) {
                    filteredEvent.push(event)
                }
                z++;
            }
            z = 0;
        })

    } else
        filteredEvent = events;
    console.log("RESULTS EVENT FILTERED :", filteredEvent);
    return filteredEvent
}

exports.getFilterPosition = (events, communityId) => {
    let z = 0;
    let i = 0;
    events.map(evt => {
        if (evt.filterCommunity == communityId)
            z = i;
        i++;
    })

    return z
}