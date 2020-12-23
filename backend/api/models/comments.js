let mongoose = require('mongoose');

// User schema
let commentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    eventId: String,
    communityId: String,
    messages: [{
        userId: String,
        username: String,
        dateOfCreation: {
            type: Date,
            default: Date.now,
        },
        userPhoto: String,
        userMessage: String,
    }],
});

let Comment = module.exports = mongoose.model('Comment', commentSchema);