const Event = require('../../models/event');
const utils = require('../utils');
const User = require('../../models/user');


getFilterOptions = (res, userId) => {

    User.find({
        userId: userId,
    })
    .exec()
    .then(usr => {
        console.log("User []", usr[0]);
        res.status(200).json({
            filterEvent: usr[0].filterEvent,
            communitiesFilter: usr[0].communitiesFilter
        })
    })
}

module.exports = {
    getFilterOptions
}