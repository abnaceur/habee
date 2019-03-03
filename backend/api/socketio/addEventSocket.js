
neweventAdded = (io) => {
    let connections = [];
    
    io.on('connection', function (client) {
        connections.push(client);
        console.log("Connected clients bgmode ...", connections.length)
        client.on('join', function (eventId) {
            client.join(eventId)
            console.log("Joined ...", client.id, eventId)
        });

        client.on('new-event', function (event) {
            client.to(event.eventCommunity).emit('broad-event', event);
            console.log("broad-event...")
        });

        client.on('disconnect', function (data) {
            connections.splice(connections.indexOf(client.id), 1);
            console.log("Disonnected clients bgmode  ...", connections.length)
            client.disconnect(true)
        });
    });
}


module.exports = {
    neweventAdded,
}