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
	eventsPhoto: String,
	eventCommunity: String,
	eventName: String,
	eventCreator: String,
	eventDescription: String,
	eventDate: Date,
	eventDuration: String,
	eventLocation: String,
	nbrParticipants: Number,
	participantsId: [],
	eventIsOver: Boolean,
	eventIsDeleted: {
        type: Boolean,
        default: false,
	},
});

let Event = module.exports = mongoose.model('Event', eventSchema);