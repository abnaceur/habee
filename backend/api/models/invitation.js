let mongoose = require('mongoose');

// Invitation schema
let invitationSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    invitationCommunityId: String,
    invitatorId: String,
    invitedEmail: String,
    contactExist: Boolean,
    status: String,
    notification: Boolean
});

let Invitation = module.exports = mongoose.model('Invitation', invitationSchema);