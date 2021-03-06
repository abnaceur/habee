let mongoose = require('mongoose');

// Event schema
let eventSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	eventId: String,
	dateOfCreation: {
		type: Date,
		default: Date.now,
	},
	dateOfLastUpdate: {
		type: Date,
		default: Date.now,
	},
	eventComNames: {
		type: Array,
		default: [],
	},
	eventCategory: String,
	eventPhoto: String,
	eventCommunity: [],
	eventName: String,
	eventCreator: String,
	eventDescription: String,
	eventStartDate: Date,
	eventStartHour: String,
	eventEndDate: Date,
	eventEndHour: String,
	eventDuration: String,
	eventLocation: String,
	nbrParticipants: Number,
	nbrSubscribedParticipants: Number,
	eventIsPublic: {
		type: Boolean,
		default: false,
	},
	participants: [{
		participantId: String,
		participantname: String,
		participantPhoto: String,
	}],
	eventIsOver: {
		type: Boolean,
		default: false,
	},
	eventIsDeleted: {
		type: Boolean,
		default: false,
	},
});

let Event = module.exports = mongoose.model('Event', eventSchema);