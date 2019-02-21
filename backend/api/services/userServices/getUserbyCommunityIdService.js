const User = require('../../models/user')
const Community = require('../../models/community')
const Event = require('../../models/event')
const utils = require('../utils')

countCommunity = () => {
    let nbProfile = 0;

    Community.count().exec()
        .then(count => {
            nbProfile = count;
        });

    return nbProfile;
}

keepOnProfile = (usrs, nbProfile, communityId) => {
    Object.entries(usrs).forEach(
        ([key, value]) => {
            nbProfile = value.profile.length - 1;
            while (nbProfile >= 0) {
                if (value.profile[nbProfile]['profileCummunityId'] !== communityId) {
                    delete value.profile[nbProfile];
                }
                nbProfile--;
            }
        }
    );

    return usrs
}

userResponse = (res, usrs, event, i) => {
    console.log("i : ", i);
    res.status(200).json({
        User: usrs.map(usr => {
            if (usr != undefined) {
                return {
                    nbrCommunities : usr.communities.length,
                    eventCreated: event.length,
                    userId: usr.userId,
                    profile: usr.profile[i],
                    nbrEventsParticipated: usr.eventsParticipated.length,
                    profileIsActive: usr.profile[i].profileUserIsActive,
                    profileRole: usr.profile[i].profileIsAdmin,
                }
            }
        })
    });
}

getUserEventInfo = (res, id, communityId, usrs) => {
    Event.find({
            eventCreator: id,
            eventCommunity: communityId,
            eventIsDeleted: false,
        }).exec()
        .then(event => {
            let z = usrs[0].profile.length;
            let t = -1;

            while (t < z) {
                t++;
                if (usrs[0].profile[t] != undefined || usrs[0].profile[t] != null)
                    if (usrs[0].profile[t].profileCummunityId === communityId)
                        break;
            }
            userResponse(res, usrs, event, t);
        })
}

getAllUserEvents = (usrs, event) => {
    let allUserEvents = [];
    let i = 0;
    let z = 0;

    while (i < usrs[0].eventsParticipated.length) {
        while (z < event.length) {
            if (usrs[0].eventsParticipated[i].eventId == event[z].eventId) {
                allUserEvents.push(event[z]);
            }
            z++;
        }
        z = 0;
        i++;
    }

    return allUserEvents;
}

getUserInfo = (req, res, id, communityId) => {

    let nbProfile = countCommunity();

    User.find({
            userId: id,
        })
        .exec()
        .then(usrs => {
            if (usrs.length === 0) {
                return res.status(200).json({
                    message: "User not found or id not valid!"
                })
            } else {
                usrs = keepOnProfile(usrs, nbProfile, communityId);
                if (usrs[0].eventsParticipated.length != 0) {
                    Event.find({
                            eventCommunity: communityId,
                            eventIsDeleted: false,
                        }).exec()
                        .then(event => {
                            usrs[0].eventsParticipated = getAllUserEvents(usrs, event);
                            getUserEventInfo(res, id, communityId, usrs)
                        })
                } else {
                    getUserEventInfo(res, id, communityId, usrs)
                }
            }
        })
        .catch(err => {
            utils.defaultError(res, err)
        });
}

module.exports = {
    userResponse,
    getAllUserEvents,
    getUserEventInfo,
    getUserInfo,
    keepOnProfile,
    countCommunity
}