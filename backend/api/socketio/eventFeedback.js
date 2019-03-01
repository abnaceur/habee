var saveComments = require('../services/eventServices/eventCommentsService')
const allCommuntiesByIds = require("../services/communityServices/communityService")


getCommmunityPosition = (community, comments, countComm) => {
    let i = 0;
    let a;

    while (i < countComm) {
        if (Object.keys(comments[i]) != null && Object.keys(comments[i]) != undefined) {
            a = Object.keys(comments[i]);
            if (community == a[0])
                break;
        }
        i++;
    }
    return i;
}

feedbackEvent = (io) => {
    let connections = [];
    let comments = [];
    let unshiftComm = [];
    let communities = [];
    let comConnectedClient = [];
    allCommuntiesByIds.getAllcommunitiesIds()
        .then(data => {
            communities = data
            let i = 0;
            let comm;
            while (i < data.length) {
                comm = data[i];
                unshiftComm.push({
                    [comm]: new Array
                })
                comments.push({
                    [comm]: new Array
                })
                i++;
            }
        })


    io.on('connection', function (client) {

        connections.push(client);
        client.on('join', function (communityId) {
            if (communities.includes(communityId)) {
                client.join(communityId)
                comConnectedClient.push({
                    [client.id]: communityId,
                })
            }
        });

        client.on('send-message', function (data) {
            io.to(data.eventCommunity).emit('broad-msg', data);

            let comm = data.eventCommunity;
            let pos = getCommmunityPosition(comm, comments, communities.length)

            comments[pos][comm].push(data)
            unshiftComm[pos][comm].unshift(data)
        });

        if (comments.length > 0) {
            client.on('getmessage', function (data) {
                let pos = getCommmunityPosition(data, unshiftComm, communities.length)
                client.emit('live-message', unshiftComm[pos][data]);
            });
        }



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
                let pos = getCommmunityPosition(communityId, comments, communities.length)
                if (comments[pos][communityId] && comments[pos][communityId].length > 0)
                    saveComments.updateComments(comments[pos][communityId])
                unshiftComm[pos][communityId] = [];
                comments[pos][communityId] = [];
            }
            client.disconnect(true)
        });
    });
}


module.exports = {
    getCommmunityPosition,
    feedbackEvent
}