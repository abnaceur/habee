# DATA MODEL
`
"community": {  
	"communityId": "String",  
	"communityName": "String",  
	"communityLogo": "PATH to image",  
	"communityAdmin": ["userId", "userId"],  
	"communityMembers": ["UserId", "userId", "userId"],  
	"dateOfCreation": "String",  
	"dateOfLastUpdate": "String",  
	"companyName": "Srring",  
	"clientId": "String",  
	"communityIsActive": "Integer"  
}  
  
"user": {  
	"userId": "String",  
	"dateOfCreation": "String",  
	"dateOfLastUpdate": "String",  
	"credentials": {  
		"surname": "String",  
		"firstname": "String",  
		"birthDate": "String",  
		"address": "String",  
		"mail": "String",  
		"phone": "String",  
		"password": "String"  
	},  
	"communities": ["communityId", "communityId"],  
	"profile": [  
		{  
			"communityId": "communityId",  
			"photo": "pathToImage",  
			"username": "String",  
			"isAdmin": "Integer",  
			"dateOfCreation": "String",  
			"dateOfLastUpdate": "String",  
			"userIsActive": "Integer"  
		},  
		{  
			"communityId": "communityId",  
			"photo": "pathToImage",  
			"username": "String",  
			"isAdmin": "Integer",  
			"dateOfCreation": "String",  
			"dateOfLastUpdate": "String",  
			"userIsActive": "Integer"  
		}  
	],  
	"passions": ["passionId", "passionId"],  
	"skills": ["skilId", "skillId"],  
	"currentEvents": {  
		"eventsICreated": ["eventId", "eventId"],  
		"eventsIParticipate": ["eventId", "eventId", "eventId", "eventId"]  
	},  
	"parameters": {  
	},  
	"passedEvents": {  
		"PassedevenementsICreated": ["eventId", "eventId"],  
		"PassedEvenementsParticipated": ["eventId", "eventId", "eventId"]  
	}  
}  
  
"passion": {  
	"passionId": "String",  
	"passionForCommunity": "communityId",  
	"passionName": "String",  
	"passionImage": "pathToImage",  
	"subPassions": [  
		{  
			"subPassionId": "String",  
			"subPassionName": "String",  
			"subPassionCategory": "passionId",  
			"subPassionImage": "pathToImage",  
			"dateOfCreation": "String",  
			"dateOfLastUpdate": "String"  
		},  
		{  
			"subPassionId": "String",  
			"subPassionName": "String",  
			"subPassionCategory": "passionId",  
			"subPassionImage": "pathToImage",  
			"dateOfCreation": "String",  
			"dateOfLastUpdate": "String"  
		}  
	]  
}  
  
"skill" : {  
	"skillId": "String",  
	"skillForCommunity": "communityId",  
	"skillName": "name",  
	"skillImage": "pathToImage",  
	"skillMastery": "String",  
	"dateOfCreation": "String",  
	"dateOfLastUpdate": "String"  
}  
  
"events": {  
	"eventId": "String",  
	"dateOfCreation": "String",  
	"dateOfLastUpdate": "String",  
	"eventCommunity": "communityId",  
	"eventName": "String",  
	"eventCreator": "userId",  
	"eventDescription": "String",  
	"eventDate": "String",  
	"eventDuration": "String",  
	"eventLocation": "String",  
	"nbrParticipants": "Integer",  
	"maxNbrParticipants": "Integer",  
	"participantsId": ["userId", "userId", "userdId"],  
	"eventIsOver": "Boolean"  
}  
`
  
# REMARQUES GÉNÉRALES
  
Dans user, on distingue eventICreated et eventIParticipate, car on peut participer a un evenement qu'on a pas creer et ne pas participer a un evenement qu'on a créé. On doit pouvior toutefois administrer l'evenement qu'on a créé, d'où la disctinction entre les deux.  
  
# FORMATS
  
## FORMAT OF COMMUNITY_ID:  
It is made of 4 parts:  

	- com => community  
	- 3 letters of the community (for habee, it would be hab)  
	- year of creation, for exemple 2018.  
	- An additional number if such an id already exists, otherwise 0.  
  
exemple: if the habee community is created in 2018, it would be __com_hab_2018__  
If we add a second habee community for the dev team only, it would be  __com_hab_2018_2__  
  
The exact same pattern applies for all id, with the following prefixes:  

	- communities => com  
	- users => usr  
	- skills => skl  
	- passions => pas  
	- events => evt  
