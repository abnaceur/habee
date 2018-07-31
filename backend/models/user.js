let mongoose = require('mongoose');

// User schema
let userSchema = mongoose.Schema({
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
        surname: String,
		firstname: String,
		birthDate: String,
		address: String,
        mail: String,
		phone: String,
        password: String,
	},
	communities: {},
	profile: [
		{
			communityId: {},
			photo: String,
			username: String,
			isAdmin: Number,
			dateOfCreation: Date,
			dateOfLastUpdate: Date,
			userIsActive: Number,
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