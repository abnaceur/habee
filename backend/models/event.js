let mongoose = require('mongoose');

// Event schema
let eventSchema = mongoose.Schema({
    eventId: String,
	dateOfCreation: {
        type: Date,
        default: Date.now,
    },
	dateOfLastUpdate: {
        type: Date,
        default: Date.now,
    },
	eventCommunity: String,
	eventName: String,
	eventCreator: String,
	eventDescription: String,
	eventDate: Date,
	eventDuration: String,
	eventLocation: String,
	nbrParticipants: Number,
	maxNbrParticipants: Number,
	participantsId: [],
	eventIsOver: Boolean,
});

let Event = module.exports = mongoose.model('Event', eventSchema);