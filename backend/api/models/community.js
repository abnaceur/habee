let mongoose = require('mongoose');

// Community schema
let communitySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    communityId: String,
	communityName: String,
	communityLogo: String,
	communityAdmin: [],
	communityMembers: [],
	dateOfCreation: {
        type: Date,
        default: Date.now,
    },
	dateOfLastUpdate: {
        type: Date,
        default: Date.now,
    },
	companyName: String,
	clientId: String,
    communityIsActive: {
        type: Boolean,
        default: true,
    }
});

module.exports = mongoose.model('Community', communitySchema);