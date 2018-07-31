let mongoose = require('mongoose');

// Community schema
let communitySchema = mongoose.Schema({
    communityId: {
        //type: mongoose.SchemaTypes.ObjectId,
        type: String,
    },
	communityName: String,
	communityLogo: String,
	communityAdmin: {},
	communityMembers: {},
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
    communityIsActive: Boolean,
});

let Community = module.exports = mongoose.model('Community', communitySchema);