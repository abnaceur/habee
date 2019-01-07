const mongoose = require('mongoose');
const Community = require('../models/community');
const User = require('../models/user')

exports.communityClassModal = (req, imagePathcommunityLogo) => {
    let classCom = {
        _id: new mongoose.Types.ObjectId,
        communityId: req.body.activeCommunity,
        communityName: req.body.activeCommunity,
        s: req.body.communityDescripton,
        communityLogo: imagePathcommunityLogo,
        communityCreator: req.body.userId,
        communityMembers: [req.body.userId],
        communityIsActive: true
    }

    return classCom
}

exports.updateUserWhenCommunityAdd = (usr, req, res) => {
    console.log("Here :")
    usr[0].profile[usr[0].profile.length] = {
        "profileUserIsActive": true,
        "profileUserIsDeleted": false,
        "profileCummunityId": req.body.communityName,
        "profilePhoto": usr[0].profile[usr[0].profile.length - 1].profilePhoto,
        "profileUsername": usr[0].credentials.firstname + usr[0].credentials.lastname,
        "profileIsAdmin": 0
    }
    usr[0].communities.push(req.body.communityName);
    usr[0].filterEvent[usr[0].filterEvent.length] = {
        "SportValue": false,
        "ArtsValue": false,
        "cultureValue": false,
        "MediaValue": false,
        "musicValue": false,
        "socialValue": false,
        "internValue": false,
        "businessValue": false,
        "communityValue": false,
        "santeValue": false,
        "itValue": false,
        "lifestyleValue": false,
        "partyValue": false,
        "meetingValue": false,
        "WorkshopValue": false,
        "filterCommunity": req.body.communityName
    }
    User.findByIdAndUpdate(usr[0]._id,
        usr[0], {
            new: false,
        }, function (err, results) {
            if (err) return res.status(500).json(err);
            res.status(200).json({
                count: 1,
                msg: "Created with success !"
            })
        })
}