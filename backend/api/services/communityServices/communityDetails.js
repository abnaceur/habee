const Community = require('../../models/community');
const User = require("../../models/user");
const utils = require('../utils')
const Event = require("../../models/event")

async function getMembersinfo(usersIds) {
    return new Promise((resolve, reject) => {
        User.find({
            userId: {
                "$in": usersIds
            }
        }).select("profile")
            .select("userId")
            .exec()
            .then(data => {
                resolve(data)
            }).catch(err => console.loe("getMembersinfo Err :", err))
    })
}

async function getEventsInfo(comId, page) {
    return new Promise((resolve, reject) => {
        Event.find({
            eventCommunity: {
                "$in": [comId]
            },
            eventIsDeleted: false,
            eventIsOver: false,
        })
            .exec()
            .then(allEvents => {
                Event.find({
                    eventCommunity: {
                        "$in": [comId]
                    },
                    eventIsDeleted: false,
                    eventIsOver: false,
                })
                    .sort('eventStartDate')
                    .skip(Number(page * 10))
                    .limit(Number(10))
                    .exec()
                    .then(data => {
                        resolve({
                            Count: allEvents.length,
                            per_page: 10,
                            total: allEvents.length,
                            total_pages: Math.floor(allEvents.length / 10),
                            events: data
                        })
                    })
                    .catch(err => console.log("getEventsInfo Err :", err))
            })
            .catch(err => console.log("getEventsInfo Err :", err))
    })
}

async function communityDetails(res, comId, page) {
    Community.find({
        communityId: comId,
        communityIsDeleted: false
    }).then(async data => {
        let members = await getMembersinfo(data[0].communityMembers)
        let events = await getEventsInfo(data[0].communityId, page);
        res.status(200).json({
            communityMembers: members,
            communityId: data[0].communityId,
            communityName: data[0].communityName,
            communityLogo: data[0].communityLogo,
            communityDescripton: data[0].communityDescripton,
            communityEvents: events
        })
    }).catch(err => utils.defaultError(res, err))
}


module.exports = {
    communityDetails,
    getMembersinfo
}