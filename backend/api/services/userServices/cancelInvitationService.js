const Invitation = require('../../models/invitation')
const userClass = require('../../classes/userClass');
const User = require('../../models/user')
const Community = require('../../models/community')
const utils = require('../utils')


cancelInvitation = (invit, res, userId) => {
    Invitation.deleteOne({
        _id: invit._id,
        invitatorId: userId,
        status: 'pending'
    }, function (err) {
        if (err) {
            console.log("cancelInvitation Err : ", err)
            res.status(200).json({
                code: 500
            })
        }
        console.log("Inviattion deleted with success.")
        res.status(200).json({
            code: 200
        })
    })
}


module.exports = {
    cancelInvitation
}