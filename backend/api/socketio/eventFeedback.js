var saveComments = require('../services/eventServices/eventCommentsService')
const allCommuntiesByIds = require("../services/communityServices/communityService")
const communityService = require("../services/communityServices/listCommunitiesByUserId");

getCommmunityPosition = (community, comments, countComm) => {

    return new Promise((resolve, reject) => {
        let i = 0;
        let a;

        while (i < countComm) {
            if (Object.keys(comments[i]) != null && Object.keys(comments[i]) != undefined) {
                a = Object.keys(comments[i]);
                if (community == a[0]) {
                    resolve(i)
                    break;
                }
            }
            i++;
        }

        resolve(0);
    })
}

getKeyPosition = (keyId, object, objectCount) => {
    let i = 0;
    let a;

    while (i < objectCount) {
        if (Object.keys(object[i]) != null && Object.keys(object[i]) != undefined) {
            a = Object.keys(object[i]);
            if (keyId == a[0]) {
                return (i)
            }
        }
        i++;
    }

    return (-1);
}

feedbackEvent = (io) => {
    let connections = [];
    let comments = [];
    let unshiftComm = [];
    let comConnectedClient = [];


    io.on('connection', function (client) {

        connections.push(client);
        client.on('join', function (eventId) {
            client.join(eventId)
            comConnectedClient.push({
                [client.id]: eventId
            });
            if (comments[eventId] == null)
                comments[eventId] = []
            if (unshiftComm[eventId] == null)
                unshiftComm[eventId] = []
            console.log("Client joined!")
        });

        client.on('send-message', function (data) {
            comments[data.eventId].push(data)
            unshiftComm[data.eventId].unshift(data)
            io.to(data.eventId).emit('broad-msg', data);
        });


        client.on('getmessage', function (eventId) {
            if (comments[eventId].length > 0) {
                client.emit('live-message', unshiftComm[eventId]);
                // io.to(data.eventCommunity + data.eventId).emit('live-message', unshiftComm[pos][data]);
            }
        });

        client.on('new-event', async function (event) {
            let i = 0;
            let userIds = [];

            while (i < comConnectedClient.length) {
                if (Object.keys(comConnectedClient[i]) != null && Object.keys(comConnectedClient[i]) != undefined) {
                    let a = Object.values(comConnectedClient[i]);
                    userIds.push(a[0]);
                }
                i++;
            }
            
            userIds.map(async userId => {
                let userComs = await communityService.getUserCreatedComsTotalEntitites(userId);
                let userPartComs = await communityService.getUserParticipatedComsTotalEntities(userId);
                let i = 0;
                let z = 0;
                let check = 0;

                userComs.concat(userPartComs);
                if (userComs.length > 0) {
                    while (i < event.eventCommunity.length) {
                        while (z < userComs.length) {
                            if (userComs[z].communityId === event.eventCommunity[i]) {
                                check = 1;
                                break;
                            }
                            z++;
                        }
                        if (check === 1)
                            break;
                        i++;
                    }
                    if (check === 1) {
                        client.to(userId).emit('broad-event', {cpmmunityName: userComs[z].communityName, eventName: event.eventName});
                    }
                    check = 0;
                }
            })
        });


        client.on('getSubDisubParticipants', function (data) {
            client.to(data.eventId).emit('broad-participants', data.participants);
        });


        client.on('disconnect', function (data) {
            let i = 0;
            let eventId;

            while (i < comConnectedClient.length) {
                if (Object.keys(comConnectedClient[i]) != null && Object.keys(comConnectedClient[i]) != undefined) {
                    let a = Object.keys(comConnectedClient[i]);
                    if (client.id == a[0]) {
                        eventId = Object.values(comConnectedClient[i])[0];
                    }
                }
                i++;
            }

            comConnectedClient.splice(comConnectedClient.indexOf(client.id), 1);

            if (eventId != undefined && (i - 1) === 0) {
                if (comments[eventId] && comments[eventId].length > 0) {
                    saveComments.updateComments(comments[eventId])
                }
                unshiftComm[eventId] = [];
                comments[eventId] = [];
            }

            client.disconnect(true)
            console.log("Client disconnected!")
        });
    });
}


module.exports = {
    getCommmunityPosition,
    feedbackEvent
}