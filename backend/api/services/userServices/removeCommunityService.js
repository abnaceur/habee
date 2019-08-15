const User = require('../../models/user')
const Community = require('../../models/community')
const Event = require('../../models/event');
const utils = require('../utils');
const Invitation = require('../../models/invitation')


async function updatCommunityMembersList(communityId, contactId) {
    return new Promise((resolve, reject) => {
        Community.find({
            communityId: communityId,
            communityIsDeleted: false
        }).exec()
            .then(com => {
                com[0].communityMembers.splice(com[0].communityMembers.indexOf(contactId), 1)
                Community.findByIdAndUpdate(com[0]._id,
                    com[0], {
                        new: false,
                    },
                    function (err, results) {
                        if (err) resolve(false)
                        resolve(true)
                    })
            })
            .catch(err => {
                console.log("updatCommunityMembersList ERR: ", err);
                resolve(false)
            })
    })
}


async function updatContactCommunitiesList(communityId, contactId) {
    return new Promise((resolve, reject) => {
        User.find({
            userId: contactId
        }).exec()
            .then(usr => {
                usr[0].communities.splice(usr[0].communities.indexOf(communityId), 1)
                User.findByIdAndUpdate(usr[0]._id,
                    usr[0], {
                        new: false,
                    },
                    function (err, results) {
                        if (err) resolve(false)
                        resolve(true)
                    })
            }).catch(err => {
                console.log("updatContactCommunitiesList error : ", err);
                resolve(false)
            })
    })
}

async function updateinvitationList(invitedId, communityId) {
    return new Promise((resolve, reject) => {
        Invitation.find({
            invitedId: invitedId,
            invitationCommunityId: communityId,
            status: "accepted"
        }).exec()
            .then(invit => {
                Invitation.deleteOne({
                    _id: invit[0]._id
                }, function (err) {
                    if (err) resolve(false)
                    resolve(true)
                })
            })
            .catch(err => {
                console.log("updateinvitationList : ", err);
                resolve(false)
            })
    })
}

updateEvents = (events) => {
    let check = 0;
    events.map(ev => {
        Event.findByIdAndUpdate(ev._id,
            ev, {
                new: false,
            },
            function (err, results) {
                if (err) check = 1;
            })
    })
    if (check != 0)
        return Promise.resolve(false);
    else
        return Promise.resolve(true);
}


async function updateUserEventParticipated(events, contactId) {
    return new Promise((resolve, reject) => {
        User.find({
            userId: contactId
        }).exec()
            .then(usr => {
                if (usr[0].eventsParticipated.length > 0) {
                    let i = 0;
                    let z = 0;

                    while (i < usr[0].eventsParticipated.length) {
                        while (z < events.length) {
                            if (usr[0].eventsParticipated[i].eventId == events[z].eventId) {
                                usr[0].eventsParticipated.splice(usr[0].eventsParticipated.indexOf(events[z].eventId), 1);
                            }
                            z++;
                        }
                        z = 0;
                        i++;
                    }
                    User.findByIdAndUpdate(usr[0]._id,
                        usr[0], {
                            new: false,
                        },
                        function (err, results) {
                            if (err) resolve(false);
                            console.log("zzzzzzzzzzzzzzzzzz");
                            resolve(true);
                        })
                } else
                    resolve(true);
            }).catch(err => {
                console.log("updateUserEventParticipated ERR :", err);
                reject(err);
            })
    })
}

async function updateEventParticipantsList(events, contactId) {
    let i = 0;
    let z = 0;
    let newList = [];

    events.map(ev => {
        if (ev.participants.length > 0) {
            ev.participants.map(pr => {
                if (pr.participantId === contactId) {
                    ev.participants.splice(z, 1);
                }
                z++;
            })
            newList.push(ev);
        }
        z = 0;
        i++;
    })

    if (await updateEvents(newList))
        if (await updateUserEventParticipated(newList, contactId)) {
            return Promise.resolve(true);
        }
        else {
            return Promise.resolve(false);
        }
}

async function updateEventSubscribedContact(contactId, communityId) {
    return new Promise((resolve, reject) => {
        Event.find({
            eventIsOver: false,
            eventIsDeleted: false,
            eventCommunity: {
                "$in": [communityId]
            }
        }).exec()
            .then(async events => {
                if (events.length === 0)
                    resolve(true);
                else {
                    if (await updateEventParticipantsList(events, contactId))
                        resolve(true);
                    else {
                        resolve(false);
                    }
                }
            })
            .catch(err => console.log("updateEventSubscribedContact ERR : ", err))
    })
}

async function removeCommunity(res, contactId, communityId) {
    if (await updatContactCommunitiesList(communityId, contactId) == true) {
        if (await updatCommunityMembersList(communityId, contactId) == true) {
            if (await updateinvitationList(contactId, communityId) == true) {
                if (await updateEventSubscribedContact(contactId, communityId)) {
                    res.status(200).json({
                        msg: "Succes",
                        code: 200
                    })
                } else {
                    res.status(200).json({
                        msg: "Failed",
                        code: 500
                    })
                }
            } else {
                res.status(200).json({
                    msg: "Failed",
                    code: 500
                })
            }
        } else {
            res.status(200).json({
                msg: "Failed",
                code: 500
            })
        }
    } else {
        res.status(200).json({
            msg: "Failed",
            code: 500
        })
    }
}

module.exports = {
    removeCommunity,
    updateinvitationList,
    updatContactCommunitiesList,
    updateEventParticipantsList,
    updatCommunityMembersList
}