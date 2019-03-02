
neweventAdded = (io) => {
    let connections = [];
    let events = [];
    
    io.on('connection', function (client) {
        connections.push(client);
        console.log("Connected clients ...", connections.length)
        client.on('join', function (eventId) {
            client.join(eventId)
            console.log("Joined ...", client.id, eventId)
        });

        client.on('new-event', function (event) {
            console.log("here new event", event)
            client.to(event.eventCommunity).emit('broad-event', event);
            console.log("broad-event...")
        });

        client.on('disconnect', function (data) {
            console.log("Disonnected clients ...", connections.length)
            client.disconnect(true)
        });
    });
}


module.exports = {
    neweventAdded,
}