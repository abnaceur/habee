let mongoose = require('mongoose');

// User schema
let userSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	userId: String,
	activeCommunity: String,
	activeProfileRole: Number,
	firstConnection: {
		type: Number,
		default: 0,
	},
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
	profile: [{
		profileCummunityId: String,
		profilePhoto: String,
		profileCoverPhoto: String,
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
	}, ],
	filterEvent: [{
		filterCommunity: String,
		PublicValue: {
			type: Boolean,
			default: false,
		},
		SportValue: {
			type: Boolean,
			default: false,
		},
		ArtsValue:  {
			type: Boolean,
			default: false,
		},
		cultureValue:  {
			type: Boolean,
			default: false,
		},
		MediaValue:  {
			type: Boolean,
			default: false,
		},
		musicValue:  {
			type: Boolean,
			default: false,
		},
		socialValue:  {
			type: Boolean,
			default: false,
		},
		internValue:  {
			type: Boolean,
			default: false,
		},
		businessValue:  {
			type: Boolean,
			default: false,
		},
		communityValue:  {
			type: Boolean,
			default: false,
		},
		santeValue:  {
			type: Boolean,
			default: false,
		},
		itValue: {
			type: Boolean,
			default: false,
		},
		lifestyleValue:  {
			type: Boolean,
			default: false,
		},
		partyValue:  {
			type: Boolean,
			default: false,
		},
		meetingValue:  {
			type: Boolean,
			default: false,
		},
		WorkshopValue:  {
			type: Boolean,
			default: false,
		},
	}],
	passions: [],
	skills: [],
	eventsParticipated: [],
});

let User = module.exports = mongoose.model('User', userSchema);