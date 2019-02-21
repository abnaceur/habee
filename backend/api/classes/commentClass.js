const mongoose = require('mongoose');
const Comment = require('../models/comments');
const User = require('../models/user')



exports.commentClassModal = (eventId, communityId) => {
    let classComment = {
        _id: new mongoose.Types.ObjectId,
        eventId: eventId,
        communityId: communityId,
        messages: []
    }

    return classComment
}