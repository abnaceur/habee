const express = require('express');
const mongoose = require('mongoose');
const eventService = require('../services/eventService')



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


exports.countActiveFilters = (filter) => {
    console.log("testing", filter)
    let i = 0;
    let activeFilters = []

    filter.SportValue == true ? (activeFilters[i] = "Sports", i++) : i = i;
    filter.ArtsValue == true ? (activeFilters[i] = "Arts", i++) : i = i;
    filter.cultureValue == true ? (activeFilters[i] = "Culture", i++) : i = i;
    filter.MediaValue == true ? (activeFilters[i] = "Media", i++) : i = i;
    filter.musicValue == true ? (activeFilters[i] = "Music", i++) : i = i;
    filter.socialValue == true ? (activeFilters[i] = "Social", i++) : i = i;
    filter.internValue == true ? (activeFilters[i] = "International", i++) : i = i;
    filter.businessValue == true ? (activeFilters[i] = "Business", i++) : i = i;
    filter.communityValue == true ? (activeFilters[i] = "Communite", i++) : i = i;
    filter.santeValue == true ? (activeFilters[i] = "Sante", i++) : i = i;
    filter.itValue == true ? (activeFilters[i] = "Science et technologie", i++) : i = i;
    filter.lifestyleValue == true ? (activeFilters[i] = "Style de vie", i++) : i = i;
    filter.partyValue == true ? (activeFilters[i] = "Fete", i++) : i = i;
    filter.meetingValue == true ? (activeFilters[i] = "Rencontre", i++) : i = i;
    filter.WorkshopValue == true ? (activeFilters[i] = "Workshop", i++) : i = i;

    results = {
        i: i,
        activeFilters: activeFilters
    }
    return results
}



exports.filterEvents = (argEvents, filter, userId) => {
    let results = this.countActiveFilters(filter);
    let activeFilters = results.activeFilters;
    let i = results.i;
    let filteredEvent = [];
    let z = 0;

    if (i != 0) {
        argEvents.map(event => {
            while (z < i) {
                if (event.eventCategory == activeFilters[z]) {
                    filteredEvent.push(event)
                }
                z++;
            }
            z = 0;
        })

    } else
        filteredEvent = argEvents;

    let filterPublicEvent = []
    z = 0;

    if (filter.PublicValue === true) {
        return new Promise((resolve, reject) => {
            eventService.getAllpublicEvents()
                .then(events => {
                    if (i != 0) {
                        events.map(event => {
                            while (z < i) {
                                if (event.eventCategory == activeFilters[z] &&
                                    (filteredEvent.length != 0 ? event.eventCreator != userId : userId)) {
                                    filterPublicEvent.push(event)
                                }
                                z++;
                            }
                            z = 0;
                        })
                    }

                    if (i === 0 && argEvents.length === 0) {
                        events.map(event => {
                            filterPublicEvent.push(event)
                        })
                    }
                    filterPublicEvent = this.concatArrays(filterPublicEvent, filteredEvent)
                    resolve(filterPublicEvent)
                })
        })

    } else {
        return new Promise((resolve, reject) => {
            resolve(filteredEvent)
        })
    }
}

exports.concatArrays = (arr1, arr2) => {
    arr2.map(a => {
        arr1.push(a)
    })

    return arr1
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