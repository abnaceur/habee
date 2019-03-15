const User = require('../../models/user')
const utils = require('../utils')



updateThisUserNotification = (res, userId, notifStatus) => {
    User.find({
        userId: userId
    }).exec()
    .then(usr => {
        usr[0].notificationStatus = notifStatus;  
        User.findByIdAndUpdate(usr[0]._id,
            usr[0], {
                new: false,
            },
            function (err, results) {
                if (err) return res.status(500).json(err);
                res.status(200).json({
                    code: 200,
                    msg: "Notification updated successefully"
                })
            });
    }).catch(err => utils.defaultError(res, err));
}

module.exports = {
    updateThisUserNotification
}