let mongoose = require('mongoose');

// User schema
let userSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	userId: String,
	activeCommunity: String,
	activeProfileRole: Number,
	dateOfCreation: {
     type: Date,
     default: Date.now,
    },
	dateOfLastUpdate: {
        type: Date,
        default: Date.now,
    },
	credentials: {
        lastname: {
			type: String,
			required: true,
		},
		firstname: {
			type: String,
			required: true,
		},	
		birthDate: String,
		address: String,
        email: {
			type: String,
			required: true,
			unique: true,
			match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
		},
		phone: String,
        password: {
			type: String,
			required: true,
		},
	},
	communities: [],
	profile: [
		{
			profileCummunityId: String,
			profilePhoto: String, 
			profileUsername: String,
			profileIsAdmin: Number,
			profileDateOfCreation: {
				type: Date,
				default: Date.now,
			},
			profileDateOfLastUpdate: {
				type: Date,
				default: Date.now
			},
			profileUserIsActive: {
				type: Boolean,
				default: true,
			},
			profileUserIsDeleted: {
				type: Boolean,
				default: false,
			}
		},
	],
	passions: [],
	skills: [],
	eventsParticipated: [],
});

let User = module.exports = mongoose.model('User', userSchema);