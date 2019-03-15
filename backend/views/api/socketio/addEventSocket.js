
neweventAdded = (io) => {
    let connections = [];
    
    io.on('connection', function (client) {
        connections.push(client);
        client.on('join', function (eventId) {
            client.join(eventId)
        });

        client.on('new-event', function (event) {
            client.to(event.eventCommunity).emit('broad-event', event);
        });

        client.on('disconnect', function (data) {
            connections.splice(connections.indexOf(client.id), 1);
            client.disconnect(true)
        });
    });
}


module.exports = {
    neweventAdded,
}