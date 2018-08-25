let mongoose = require('mongoose');

// Passion schema
let passionSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
	passionId: String,
	passionForCommunity: String,
	passionName: String,
	//passionImage: String,
	subPassions: [
		{
			subPassionId: String,
			subPassionForCommunity: String,
			subPassionName: String,
			subPassionCategory: String,
			subPassionImage: String,
			dateOfCreation: {
				type: Date,
				default: Date.now
			},
			dateOfLastUpdate: {
				type: Date,
				default: Date.now
			},
		}
	]
});

let Passion = module.exports = mongoose.model('Passion', passionSchema);