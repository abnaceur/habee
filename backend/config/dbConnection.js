var mongoose = require('mongoose');

// Set the path to the database
mongoose.connect('mongodb://'+ process.env.DB_HOST + '/' + process.env.DB_NAME);

let db = mongoose.connection;

let DB = module.exports = db;