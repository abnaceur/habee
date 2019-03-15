var saveComments = require('../services/eventServices/eventCommentsService')
const allCommuntiesByIds = require("../services/communityServices/communityService")


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

feedbackEvent = (io) => {
    let connections = [];
    let comments = [];
    let unshiftComm = [];
    let comConnectedClient = [];


    io.on('connection', function (client) {

        connections.push(client);
        client.on('join', function (communityId) {
            client.join(communityId)
            comConnectedClient.push({
                [client.id]: communityId
            });
            console.log("Client joined!")

            getCommmunityPosition(communityId, comments, comments.length)
                .then(pos => {
                    if (pos == 0) {
                        unshiftComm.push({
                            [communityId]: new Array
                        })
                        comments.push({
                            [communityId]: new Array
                        })
                    }
                })
        });

        client.on('send-message', function (data) {

            let comm = data.eventCommunity + data.eventId;
            getCommmunityPosition(comm, comments, (comments.length + 1))
                .then(pos => {
                    comments[pos][comm].push(data)
                    getCommmunityPosition(comm, unshiftComm, (unshiftComm.length + 1))
                        .then(pos => {
                            unshiftComm[pos][comm].unshift(data)
                        })
                })
            io.to(data.eventCommunity + data.eventId).emit('broad-msg', data);
        });

        if (comments.length > 0) {
            client.on('getmessage', function (data) {
                getCommmunityPosition(data, unshiftComm, unshiftComm.length + 1)
                    .then(pos => {
                        client.emit('live-message', unshiftComm[pos][data]);
                       // io.to(data.eventCommunity + data.eventId).emit('live-message', unshiftComm[pos][data]);
                    })
            });
        }

        client.on('new-event', function (event) {
            client.to(event.eventCommunity).emit('broad-event', event);
        });


        client.on('getSubDisubParticipants', function (data) {
            client.to(data.userId).emit('broad-participants', data.participants);
        });


        client.on('disconnect', function (data) {
            let i = 0;
            let communityId;

            while (i < comConnectedClient.length) {
                if (comConnectedClient[i][client.id])
                    communityId = comConnectedClient[i][client.id]
                i++;
            }

            comConnectedClient.splice(comConnectedClient.indexOf(client.id), 1);

            i = 0;
            let count = 0;

            while (i < comConnectedClient.length) {
                if (Object.values(comConnectedClient[i]) == communityId)
                    count++;
                i++;
            }


            if (communityId != undefined && i === 0) {
                getCommmunityPosition(communityId, comments, comments.length + 1)
                    .then(pos => {
                        if (comments[pos][communityId] && comments[pos][communityId].length > 0)
                            saveComments.updateComments(comments[pos][communityId])
                        unshiftComm[pos][communityId] = [];
                        comments[pos][communityId] = [];

                    })
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