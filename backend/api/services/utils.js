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
        from: process.env.USER,
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
    let i = 0;
    let activeFilters = []

    filter.map(fls => {
        if (fls.value === true && fls.filter != "publicEvents") {
            activeFilters[i] = fls.name;
            i++;
        }
    })

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

    if (filter[0].value === true) {
        return new Promise((resolve, reject) => {
            eventService.getAllpublicEvents()
                .then(events => {
                    if (i != 0) {
                        events.map(event => {
                            while (z < i) {
                                if (event.eventCategory == activeFilters[z]) {
                                    if (this.checkIfexist(filteredEvent, event) == false)
                                        filterPublicEvent.push(event)
                                }
                                z++;
                            }
                            z = 0;
                        })
                    } else {
                        events.map(event => {
                            filterPublicEvent.push(event)
                        })
                    }
                    filterPublicEvent = this.concatArraysUser(filterPublicEvent, filteredEvent)
                    resolve(filterPublicEvent)
                })
        })
    } else {
        return new Promise((resolve, reject) => {
            resolve(filteredEvent)
        })
    }
}

exports.checkIfexist = (arr1, ev) => {
    let check = 0;

    arr1.map(ev1 => {
        if (ev.eventId == ev1.eventId) {
            check++;
            return true
        }
    })
    if (check === 0)
        return false

}

exports.concatArraysUser = (arr1, arr2) => {
    if (arr1.length != 0) {
        arr2.map(a => {
            if (this.checkIfexist(arr1, a) == false) {
                arr1.push(a)
            }
        })
    } else if (arr1.length === 0) {
        arr1 = arr2
    } else
        arr1 = arr2
    return arr1
}

exports.concatArrays = (arr1, arr2) => {
    arr2.map(a => {
        arr1.push(a)
    })

    return arr1
}

exports.uniqueArray = (z, arr, count) => {
    let i = count - 1;
    let check = 0;

    while (z < count) {
        while (i > 0) {
            if (arr[z] === arr[i]) {
                check++;
                break;
            }
            i--;
        }
        if (check != 0) { arr.splice(i, 1) }
        i = count - 1;
        z++;
    }
    return arr
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

exports.randomValueGenerator = () => {
    return Math.floor(Math.random() * 10000) + Math.random().toString(36).substring(7) + Math.random().toString(36).substring(7).toUpperCase() + "$";
}

exports.getComImagePath = (req, imageBody) => {
    let imagePath;
    let comLogo = Math.floor(Math.random() * 8) + 1;

    if (imageBody != undefined && imageBody != "")
        imagePath = imageBody;
    else if (req.files == undefined)
        imagePath = "uploads/HABEECOM" + comLogo + ".png"
    else if (req.files != undefined)
        imagePath = req.files[0].path;

    return imagePath
}

exports.getImagePath = (req, imageBody) => {
    let imagePath;

    if (imageBody != undefined && imageBody != "")
        imagePath = imageBody;
    else if (req.files == undefined)
        imagePath = "uploads/defaultEventImage.jpeg"
    else if (req.files != undefined)
        imagePath = req.files[0].path;

    return imagePath
}