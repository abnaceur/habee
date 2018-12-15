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
	eventCategory: String,
	eventPhoto: String,
	eventCommunity: String,
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