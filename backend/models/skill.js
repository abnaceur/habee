let mongoose = require('mongoose');

// Skill schema
let skillSchema = mongoose.Schema({
    skillId: String,
	skillForCommunity: String,
	skillName: String,
	skillImage: String,
	skillMastery: String,
	dateOfCreation: {
        type: Date,
        default: Date.now,
    },
    dateOfLastUpdate: {
        type: Date,
        defualt: Date.now,
    },
});

let Skill = module.exports = mongoose.model('Skill', skillSchema);