let mongoose = require('mongoose');

// User schema
let userSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
    userId: String,
	dateOfCreation: {
     type: Date,
     default: Date.now,
    },
	dateOfLastUpdate: {
        type: Date,
        default: Date.now,
    },
	credentials: {
        username: {
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
			//profilePhoto: String, 
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
			}
		},
	],
	passions: [],
	skills: [],
	currentEvents: {
		eventsICreated: [],
	    eventsIParticipate: []
	},
	parameters: {},
	passedEvents: {
		PassedevenementsICreated: [],
		PassedEvenementsParticipated: []
	}
});

let User = module.exports = mongoose.model('User', userSchema);