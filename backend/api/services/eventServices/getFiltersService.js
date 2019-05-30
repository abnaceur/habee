const Event = require('../../models/event');
const utils = require('../utils');
const User = require('../../models/user');


getFilterOptions = (res, userId) => {

    User.find({
        userId: userId,
    })
    .exec()
    .then(usr => {
        res.status(200).json({
            filterEvent: usr[0].filterEvent
        })
    })
}

module.exports = {
    getFilterOptions
}