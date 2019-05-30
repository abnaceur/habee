let mongoose = require('mongoose');

// User schema
let userSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	userId: String,
	activeCommunity: String,
	activeProfileRole: Number,
	notificationStatus: {
		type: Boolean,
		default: true,
	},
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
	profile: {
		profileCummunityId: String,
		profilePhoto: String,
		profileCoverPhoto: String,
		profileLastname: String,
		profileFirstname: String,
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
	},
	filterEvent: [{
		name: {
			type: String,
			default: "Publique"
		},
		filter: {
			type: String,
			default: "publicEvents"
		},
		value: {
			type: Boolean,
			default: false,
		},
	},{
		name: {
			type: String,
			default: "Sortie entre amis"
		},
		filter: {
			type: String,
			default: "sortieEntreAmis"
		},
		value: {
			type: Boolean,
			default: false,
		},
	}, {
		name: {
			type: String,
			default: "Afterwork"
		},
		filter: {
			type: String,
			default: "afterwork"
		},
		value: {
			type: Boolean,
			default: false,
		}
	}, {
		name: {
			type: String,
			default: "Cinéma"
		},
		filter: {
			type: String,
			default: "cinema"
		},
		value: {
			type: Boolean,
			default: false,
		}
	}, {
		name: {
			type: String,
			default: "Sport"
		},
		filter: {
			type: String,
			default: "sport"
		},
		value: {
			type: Boolean,
			default: false,
		}
	}, {
		name: {
			type: String,
			default: "Repas de famille"
		},
		filter: {
			type: String,
			default: "repasDeFamille"
		},
		value: {
			type: Boolean,
			default: false,
		}
	}, {
		name: {
			type: String,
			default: "Farniente"
		},
		filter: {
			type: String,
			default: "farniente"
		},
		value: {
			type: Boolean,
			default: false,
		}
	}, {
		name: {
			type: String,
			default: "Shopping"
		},
		filter: {
			type: String,
			default: "shopping"
		},
		value: {
			type: Boolean,
			default: false,
		}
	}, {
		name: {
			type: String,
			default: "Ballade"
		},
		filter: {
			type: String,
			default: "ballade"
		},
		value: {
			type: Boolean,
			default: false,
		}
	}, {
		name: {
			type: String,
			default: "Virée en vélo"
		},
		filter: {
			type: String,
			default: "virreEnVelo"
		},
		value: {
			type: Boolean,
			default: false,
		}
	}, {
		name: {
			type: String,
			default: "Virée en voiture"
		},
		filter: {
			type: String,
			default: "vireEnVoiture"
		},
		value: {
			type: Boolean,
			default: false,
		}
	}, {
		name: {
			type: String,
			default: "Picnic"
		},
		filter: {
			type: String,
			default: "picnic"
		},
		value: {
			type: Boolean,
			default: false,
		}
	}, {
		name: {
			type: String,
			default: "Anniversaire"
		},
		filter: {
			type: String,
			default: "anniversaire"
		},
		value: {
			type: Boolean,
			default: false,
		}
	}, {
		name: {
			type: String,
			default: "Danse"
		},
		filter: {
			type: String,
			default: "danse"
		},
		value: {
			type: Boolean,
			default: false,
		}
	}, {
		name: {
			type: String,
			default: "Cutlure"
		},
		filter: {
			type: String,
			default: "cutlure"
		},
		value: {
			type: Boolean,
			default: false,
		}
	}, {
		name: {
			type: String,
			default: "Nature"
		},
		filter: {
			type: String,
			default: "nature"
		},
		value: {
			type: Boolean,
			default: false,
		}
	}, {
		name: {
			type: String,
			default: "Evènement en ville"
		},
		filter: {
			type: String,
			default: "evenementEnVille"
		},
		value: {
			type: Boolean,
			default: false,
		}
	}, {
		name: {
			type: String,
			default: "Spectacle"
		},
		filter: {
			type: String,
			default: "spectacle"
		},
		value: {
			type: Boolean,
			default: false,
		}
	}, {
		name: {
			type: String,
			default: "Retrouvailles"
		},
		filter: {
			type: String,
			default: "retrouvailles"
		},
		value: {
			type: Boolean,
			default: false,
		}
	}, {
		name: {
			type: String,
			default: "Cousinade"
		},
		filter: {
			type: String,
			default: "cousinade"
		},
		value: {
			type: Boolean,
			default: false,
		}
	}, {
		name: {
			type: String,
			default: "Match"
		},
		filter: {
			type: String,
			default: "match"
		},
		value: {
			type: Boolean,
			default: false,
		}
	}],
	passions: [],
	skills: [],
	eventsParticipated: [],
});

let User = module.exports = mongoose.model('User', userSchema);