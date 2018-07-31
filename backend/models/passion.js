let mongoose = require('mongoose');

// Passion schema
let passionSchema = mongoose.Schema({
	passionId: String,
	passionForCommunity: String,
	passionName: String,
	passionImage: String,
	subPassions: [
		{
			subPassionId: String,
			subPassionName: String,
			subPassionCategory: String,
			subPassionImage: String,
			dateOfCreation: Date,
			dateOfLastUpdate: Date,
		}
	]
});

let Passion = module.exports = mongoose.model('Passion', passionSchema);