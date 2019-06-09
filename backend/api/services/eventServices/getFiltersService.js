const Event = require('../../models/event');
const utils = require('../utils');
const User = require('../../models/user');

sortAlphaFilter = (filter) => {
    alpha = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
    sortedFilter = [];

    return new Promise((resolve, reject) => {
        alpha.map(char => {
            filter.map(fls => {
                if (fls.name[0].toLowerCase() === char)
                    sortedFilter.push(fls)
            })
        })
        resolve(sortedFilter)
    })
}


async function getFilterOptions (res, userId) {
    let filters = [];

    User.find({
        userId: userId,
    })
        .sort({ filterEvent: 1 })
        .exec()
        .then(async usr => {
            filters = await sortAlphaFilter(usr[0].filterEvent);
            res.status(200).json({
                filterEvent: filters,
                communitiesFilter: usr[0].communitiesFilter
            })
        })
}

module.exports = {
    getFilterOptions,
    sortAlphaFilter
}