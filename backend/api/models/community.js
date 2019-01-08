let mongoose = require('mongoose');

// Community schema
let communitySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    communityId: String,
	communityName: String,
    communityLogo: String,
    communityCreator: String,
    communityMembers: [],
    communityDescripton: String,
	dateOfCreation: {
        type: Date,
        default: Date.now,
    },
	dateOfLastUpdate: {
        type: Date,
        default: Date.now,
    },
    communityIsActive: {
        type: Boolean,
        default: true,
    },
    communityIsDeleted: {
        type: Boolean,
        default: false,
	}
});

module.exports = mongoose.model('Community', communitySchema);
