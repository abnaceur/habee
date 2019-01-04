const mongoose = require('mongoose');
const Community = require('../models/community');

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