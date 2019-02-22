#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('../app');
var debug = require('debug')('backoffice:server');
var http = require('http');
var socket = require('socket.io')
var saveComments = require('../api/services/eventServices/eventCommentsService')

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

var io = socket(server);
connections = [];
let comments = [];
let unshiftComm = [];

io.on('connection', function (client) {
  console.log('Client connected...', client.id);

  connections.push(client);
  console.log('Connected clients ...', connections.length);


  client.on('send-message', function (data) {
    client.emit('broad-msg', data);
    comments.push(data)
    unshiftComm.unshift(data)
    client.broadcast.emit('broad-msg', data);
  });

  if (comments.length > 0)
  {
    client.on('getmessage', function (data) {
      client.emit('live-message', unshiftComm);
    });
  }

  client.on('disconnect', function () {

    console.log("Disconnected here ... ", client.id)
    client.disconnect(true)
    connections.splice(connections.indexOf(client), 1);
    if (connections.length === 0) {
      saveComments.updateComments(comments)
      unshiftComm = [];
      comments = [];
    }
  });
});
/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string' ?
    'Pipe ' + port :
    'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string' ?
    'pipe ' + addr :
    'port ' + addr.port;
  debug('Listening on ' + bind);
}