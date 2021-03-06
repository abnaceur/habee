let mongoose = require('mongoose');

// Invitation schema
let invitationSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    invitationCommunityId: String,
    InvitationCommunitName: String,
    invitatorId: String,
    invitorFullname: String,
    invitedEmail: String,
    invitedId: String,
    invitedFullname: String,
    contactExist: Boolean,
    status: String,
    notification: Boolean,
    dateOfCreation: {
        type: Date,
        default: Date.now,
    },
});

let Invitation = module.exports = mongoose.model('Invitation', invitationSchema);