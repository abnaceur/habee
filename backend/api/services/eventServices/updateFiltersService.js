const Event = require('../../models/event');
const utils = require('../utils');
const User = require('../../models/user');


updateFilterOptions = (req, res, userId) => {

    User.find({
        userId: userId
    })
    .exec()
    .then(usr => {
        usr[0].filterEvent = req.body.filter;
        usr[0].communitiesFilter = req.body.communities;
        User.findByIdAndUpdate(usr[0]._id,
            usr[0], {
                new: false,
            },
            function (err, results) {
                if (err) return res.status(500).json(err);
                console.log("FILTER UPDATED")
            });
    })
}

module.exports = {
    updateFilterOptions
}