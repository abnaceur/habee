# Data Model of the Habbe project
<pre>
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
</pre>

## Commentaries
Les champs passionForCommunity permettent de specifier des passions differentes
pour des communautes differentes. Ainsi, on limite les duplicats de donnes pour
l'utilisateur tout en lui permettant d'avoir un profile different pour chaque 
communaute.

Le champ eventId permet d'avoir un compte utilisateur pour l'ensemble des
communautes, tout en ayant des evenements differents pour les communautes.

Dans user, on distingue eventICreated et eventIParticipate, car on peut participer
a un evenement qu'on a pas creer et ne pas participer a un evenement qu'on a pas
creer. On doit pouvior toutefois administrer l'evenement au'on a cree, d'ou la
disctinction entre les deux.

## IDs formats

There are multiple Ids in Habee:  
<pre>
	- communityId
	- userId
	- passionId
	- skillId
	- eventId
</pre>
  
Here are the different formats of the ids.
  
__COMMUNITYID FORMAT__:  
`com_X_year_nbr`
  
`com` indicates this is a communityId.  
`X` contains the first 3 letters of the communityName. For exemple, for the community Habee, they would be hab. This amounts to a total of 17576 different communities.  
`year` is the year of creation of the community.  
nbr uniquely indentifies the community if there already is one with the exact same name, created the same year. It begins at 0.  
  
In the case of Habee, the id would be `com_hab_2018_0`.  
If the habaa community would be created the same year as our habee community, then its id would be `com_hab_2018_1`.  
  
__USER_FORMAT__:  
`usr_X_year_nbr.`  
  
The rules are pretty much the same than for the communityId.  
The X contains the first 3 letters of the name of the user.  
  
For exemple, the user Jean, created in 2020 would have an ID of `usr_jea_2020_0`.  
If a second user named Jean is created in 2020, is id would then be: `usr_jea_2020_1`.
  
__PASSION_ID__:  
`pas_X_nbr.`  
  
The X contains the full name of the passion (the sub_pasison of the data model), not the general passion.  
For exemple, if the passion is "footbal", in the category "sport", the the passionId would be: `pas_football_0`.  
  
__SKILL_ID__:  
`skl_X_nbr.`
  
Same rule as above. X contains the full name of the skill.  
For exemple `skl_excel_0`.
  
__EVENT_ID__:  
`evt_X_year_month_nbr.`  
  
The X contains the first 3 letters of the community the event was created in.  
The month follows a 2 digits rule. The month of july is 07, and not just 7.  
For exemple, if an event is created on jully 2018, in the community habee, its id would be: `evt_hab_2018_07_0`.  
The second event created during july 2018 by habee would have the id: `evt_hab_2018_07_1`.  
However, the first event of the month of agust, in 2018 by the team habee would be: `evt_2018_08_0`, since it is the first event on the month of agust.  
