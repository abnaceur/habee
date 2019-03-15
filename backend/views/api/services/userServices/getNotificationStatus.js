const User = require('../../models/user')
const utils = require('../utils')



getNotificationStatusThisUser = (res, userId) => {
    User.find({
        userId: userId
    }).exec()
    .then(usr => {  
        res.status(200).json({
            status: usr[0].notificationStatus,
            code: 200,
            msg: "Get user notification"
        })
    }).catch(err => utils.defaultError(res, err));
}

module.exports = {
    getNotificationStatusThisUser
}