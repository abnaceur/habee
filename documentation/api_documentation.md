# API documentation

The API exposed by the node server will follow as much as possible the REST principles.  
However, the flexibility and ease of use of the API is more important to us than perfectly folowing the rigid principles behind the REST convention.  
  
This api contains a lot of differents routes, more than what would seem necessary. However, having so many routes enable us to move the working load from the user to the server. The server will do the calculation faster. It also helps the user to retrieve only necessary informations: it is useless to retrieve all the profiles of a user if the only necessary profile is the one of one community only.  

## Principles of REST API:  
  
```
	- Ressources are used to identify data, not actions nor files.   
	- HTTP verbs are the action to be executed on the ressources. It should no be contained in the URI.  
	- A URI can serve data in different formats. The format is determined by the "content negociation" method, which uses __ACCEPT__ headers in HTPP requests.  
	- A human must be able to understand what a URI is serving, whithout having to read the documentation.  
	- Returned ressources must reference other ressources by their URI, not by their name. Thus, any user can immediatly query those ressources.
```
  
As said above, we should not follow those rules religiously. Developper experience (ease of use) is more important than a perfectly REST API.
  
## Rules relative to API developement  
  
Each route must be thoroughly documented. Documentation __must__ best exhaustive.  
In particular, documentation must contain:
```
	- The URI used to retrieve the ressource  
	- The supported returned format (json, html, raw text, etc...), with an exemple for each format.  
	- A description of the data.
	- The supported HTTP methods (GET, POST, etc..) and the authentication level necessary for each one of them  
```
## Routes

```
/communities										GET/POST [DONE]
/communities/id										GET/UPDATE/ [DONE]
/communities/active									GET [DONE]
/communities/isNotActive							GET [DONE]

/users												GET/POST [DONE]
/users/login										POST
/users/isNotActive									GET [DONE] 
/users/isActive										GET [DONE]
/users/administrators								GET [DONE]
/users/notAdmin										GET [DONE]	
/users/id											GET/UPDATE [DONE]
/users/id/credentials								GET/POST/UPDATE [DONE]
/users/id/communityId                               GET/POST/UPDATE [DONE]
/users/id/communityId/skills				        GET/POST/UPDATE [DONE except PATCH and POST which is related to th user]
/users/id/communityId/passions				        GET/POST/UPDATE [DONE except PATCH and POST which is related to th user]
/users/id/communityId/currentEvents			        GET/POST/UPDATE
/users/id/communityId/passedEvents			        GET/POST/UPDATE

/passions											GET/POST [DONE]
passions/passionId									GET/POST/UPDATE [DONE]
/passions/community/communityId						GET [DONE]
/passions/community/communiyId/subpassionId			GET

/skills												GET/POST [DONE]
/skills/community/communityId						GET [DONE]
/skills/skillId										GET/UPDATE [DONE]

/events												GET/POST [DONE]
/events/eventId										GET/UPDATE [DONE]
/events/all/isOver									GET [DONE]
/events/isNotOver									GET [DONE]
/events/community/communityId						GET [DONE]
/events/communityId/isOver							GET/UPDATE [DONE]
/events/communityId/isNotOver						GET/UPDATE [DONE]
```

## /communities

__ROUTE__:  
/communities  
  
__USAGE__:   
This route is used to get all the communities on Habee, and to post new communities.  
  
__DESCRIPTION OF THE RESSOURCE__:  
This ressources contains a list of all the communities. Each community contains its name, its communityId, the number of members, the date of creation.It also contains the status of the community: active or not.  
It does no list all the users since it is supposed to offer an overview of all the communities in Habee. To have a list of all the users, you must do a GET query to /users  
  
__RETURNED FORMAT__:  
This ressource is only returned using the json format.  
We can look to expand the avaible format later on, if necessary.  
  
__CRUD__:  
Crud operations that necessitate to create a new community must be made on this route. In that case, the query must be a POST query, with a body with JSON format containing the following informations:  
__POST REQUEST EXPECTED FORMAT:__  
```
"community": {  
	"communityId": "String",  
	"communityName": "String",  
	"communityAdmin": ["userId", "userId"],  
	"communityMembers": ["UserId", "userId", "userId"],  
	"dateOfCreation": "String",  
	"dateOfLastUpdate": "String",  
	"companyName": "Srring",  
	"clientId": "String",  
	"communityIsActive": "Integer"  
}  
```
__GET REQUEST RETURNED FORMAT:__  
The ressource contains only two entries, the number of community and an array containing multiple community objects.  
```
communities": {  
	"nbrCommunities": "Integer",  
	"communities": [  
		{  
			"communityId": "Integer",  
			"communityName": "String",  
			"nbrOfUsers": "Integer",  
			"dateOfCreation": "String",  
			"dateOfLastUpdate"; "String",  
			"communityIsActive": "Integer"  
		},  
		{  
			"communityId": "Integer",  
			"communityName": "String",  
			"nbrOfUsers": "Integer",  
			"dateOfCreation": "String",  
			"dateOfLastUpdate"; "String",  
			"communityIsActive": "Integer"  
		}  
	]  
}  
```
  
Then, it will be up to the server to check the validity of this community,. The server will also accept the community if everything is ok, and reject it if there is a problem (communityId already exists, etc...)
The logo picture will be given by the client and stored on a specific file on the server. The update of the communityLogo field is made by a POST request on community/id

## /communities/id

__ROUTE:__  
/communities/id  
  
__USAGE:__  
This ressource is used to access data specific to one community: the community of id: id. The communityId is avaible in pretty much any ressource, and thus is accessbile at almost any time whithout additionnal request.  
This ressource contains the communityId, its name, the list of administrators, the list of members, the dateOfCreation and the dateOfLastUpdate, the name of the company responsable for this community. It also contains the status of the community: active or not.
  
__SUPPORTED FORMATS:__  
This ressource is only returned using the json format.  
We can look to expand the avaible format later on, if necessary.  
  
__GET REQUEST RESULT FORMAT:__  
```
"community": {  
	"communityId": "Integer",  
	"communityName": "String",  
	"communityAdmin": ["userId", "userId"],  
	"communityMembers": ["UserId", "userId", "userId"],  
	"dateOfCreation": "String",  
	"dateOfLastUpdate": "String",  
	"companyName": "String",  
	"communityIsActive": "Integer"  
}  
```

## /communities/active

__ROUTE:__  
/communities/active  
  
__USAGE:__  
This ressource answers to a GET request and list all active communities.  
  
__DESCRIPTION OF THE RESSOURCE:__  
This ressource is used to give a list of all communities whose communityIsActive field has the value active.
This ressource contains a single filed, containing an array of objects representing communities.Thoses community objects contain the communityId, the communityName, the nbrOfMembers of the community and the date of creation.
  
__SUPPORTED FORMAT:__  
This ressource is only returned using the json format.  
We can look to expand the avaible format later on, if necessary.  
  
__GET REQUEST RESULT:__  
```
"communities": {  
	"communities": [  
		{  
			"communityId": "Integer",  
			"communityName": "String",  
			"nbrOfUsers": "Integer",  
			"dateOfCreation": "String",  
			"dateOfLastUpdate"; "String",  
			"communityIsActive": "Integer"  
		},  
		{  
			"communityId": "Integer",  
			"communityName": "String",  
			"nbrOfUsers": "Integer",  
			"dateOfCreation": "String",  
			"dateOfLastUpdate"; "String",  
			"communityIsActive": "Integer"  
		}  
	]  
}  
```
  
## /communities/isNotActive
  
__ROUTE:__  
/communities/isNotActive  
  
__DESCRIPTION OF THE RESSOURCEE:__  
This ressource answers to a GET request and list all inactive communities.  
  
__USAGE:__  
This ressource is used to give a list of all communities whose communityIsActive filed has the value inactive.  
This ressource contains a single filed, containing an array of objects representing communities.Thoses community objects contain the communityId, the communityName, the nbrOfMembers of the community and the date of creation.
  
__SUPPORTED FORMAT:__  
This ressource is only returned using the json format.  
We can look to expand the avaible format later on, if necessary.  
  
__DATA:__  
Exactly the same format as /community/active  
  
## /users
  
__ROUTE:__  
/users  
  
__DESCRIPTION OF THE RESSOURCE:__  
This ressource is used to get the list of all users in the database, and to add new users to it with a post request.  
  
__USAGE:__  
This ressource is used to retrieve a list of all users. All users in the habee database will be listed, no matter their community. For this very reason, the data avaible for each user will be limited.  
  
__SUPPORTED FORMAT:__  
This ressource is only returned using the json format.  
We can look to expand the avaible format later on, if necessary.  
  
__CRUD:__  
This ressource supports the following http operations: GET & POST.
  
__GET REQUEST RESULT:__  
This ressource contains two fields: the number of users in the database, and an array of user objects.  
```
"users": {  
	"nbrOfusers": "Integer",  
	"users": [  
		"user": {  
			"userId": "String",  
			"dateOfCreaton": "String",  
			"communities": ["communityId", "communityId"],  
			"skills": ["skillId", "skillId"],  
			"passions": ["passionId", "passionId"]  
		}  
	]  
}  
```
  
__POST REQUEST EXPECTED FORMAT:__  
This is the minimum data expected to add a new user in the database.  
All fields in the user datamodel can be filled, but only those ones are necessary for the creation of a new user.  
```
"user": {
	"userId": "String",
	"dateOfCreation": "String",
	"dateOfLastUpdate": "String",
	"credentials": {
		"surname": "String",
		"firstname": "String",
		"birthDate": "String",
		"mail": "String",
		"password": "String"
	},
	"communities": ["communityId"],
	"profile": [
		{
			"communityId": "communityId",
			"username": "String",
			"isAdmin": "Integer",
			"dateOfCreation": "String",
			"dateOfLastUpdate": "String",
			"userIsActive": "Integer"
		}
	],
	"passions": [],
	"skills": [],
	"currentEvents": {
	},
	"parameters": {
	},
	"passedEvents": {
	}
}
```
  
## /users/active
  
__ROUTE:__  
/users/active
  
__USAGE:__  
This ressource is used to access all the active users, from all the database, no matter the community.  
For this very reason, the amount of data avaible for each user will be limited.  
  
__CRUD OPERATIONS:__  
This route only answers to GET requests.
  
__GET RETURNED FORMAT:__  
This ressource is only returned using the json format.
The returned data format is the same as the returned data from a GET request to the /users route.  
  
## /users/isNotActive
  
__ROUTE:__  
/users/isNotActive
  
__USAGE:__  
This ressource is used to access all the inactive users, from all the database, no matter the community.  
For this very reason, the amount of data avaible for each user will be limited.  
  
__CRUD OPERATIONS:__  
This route only answers to GET requests.
  
__GET RETURNED FORMAT:__  
This ressource is only returned using the json format.
The returned data format is the same as the returned data from a GET request to the /users route.  
  
## /users/administrators
  
__ROUTE:__  
/users/administrators
  
__USAGE:__  
This ressource is used to access all the users whose role is administrator, from all the database, no matter the community.  
For this very reason, the amount of data avaible for each user will be limited.  
  
__CRUD OPERATIONS:__  
This route only answers to GET requests.
  
__GET RETURNED FORMAT:__  
This ressource is only returned using the json format.
The returned data format is the same as the returned data from a GET request to the /users route.  
  
## /users/notAdmin
  
__ROUTE:__  
/users/notAdmin
  
__USAGE:__  
This ressource is used to access all the users who do not have an administrator role, from all the database, no matter the community.  
For this very reason, the amount of data avaible for each user will be limited.  
  
__CRUD OPERATIONS:__  
This route only answers to GET requests.
  
__GET RETURNED FORMAT:__  
This ressource is only returned using the json format.
The returned data format is the same as the returned data from a GET request to the /users route.  
  
## /users/id
  
__ROUTE:__  
/users/id  
  
__USAGE:__  
This ressource is used to access a specific user, specified by its userId.  
It is used to obtain all the informations relative to a user, and to update the information of this user.  
  
__SUPPORTED FORMATS:__  
This route answers to GET request and accepts POST request with the json format only.  
  
__CRUD OPERATIONS:__  
This rout accepts GET, PUT and POST requests.  
  
__GET RETURNED FORMAT:__  
```
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
```
  
## /users/id/credentials
  
__ROUTE__:  
/users/id/credentials  
  
__USAGE__:  
  
This route is used to access only the credentials of a user. It can be used when only thoses informations are required, for authentication for exemple, and the rest of the user's data is ireevelant.  
  
__SUPPORTED_FORMATS__:  
This route only supports JSON format, both for GET, PUT and POST request.
  
__CRUD OPERATIONS__:  
This route supports GET, PUT and POST requests.  
  
__GET_RETURNED_FORMAT__:  
```
"user": {
	"userId": "String",
	"dateOfCreation": "String",
	"dateOfLastUpdate": "String",
	"credentials": {
		"username": "String",
		"firstname": "String",
		"birthDate": "String",
		"address": "String",
		"mail": "String",
		"phone": "String",
		"password": "String"
	}
}
```

__UPDATE AND POST EXCPECTED FORMAT__:  
The route expects only a "user" object, with the userId field, and the updated or posted field(s) specified.  
The userId is absolutly necessery, otherwise the request will be rejected.
ex:  
```
"user": {
	"userId": "String",
	"credentials": {
		"surname": "String",
		"firstname": "String",
		"birthDate": "String",
		"address": "String",
		"mail": "String",
		"phone": "String",
		"password": "String"
	}
}
```

If a field is empty, it wont be updated. If the credentials field is empty, nothing will be updated. To delete all the credentials (BE CAREFUL!) you have to put all the fields inside credentials to en empty object. For exemple:  
```
"user": {
	"userId": "String",
	"credentials": {
		"surname": "{}",
		"firstname": "{}",
		"birthDate": "{}",
		"address": "{}",
		"mail": "{}",
		"phone": "{}",
		"password": "{}"
	}
}
```
  
In the above exemple, all fields inside credentials will be put to NULL.  
  
## /users/id/communityId
  
__ROUTE__:  
/users/id/communityId
  
__USAGE__:  
This route is used to access all the informations of a user relative to the community whose id is communityId.  
For exemple,  a GET query to /users/usr_jea_2018_0/com_hab_2018_0 will return all the passions, skills, username, avatar, etc... of the user for the community /users/usr_jea_2018_0/com_hab_2018_0   
  
__SUPPORTED FORMATS__:  
This route only supports the json format for all requests, GET, POST, and PUT.  
  
  __CRUD_OPERATIONS__:  
This route supports GET, POST AND PUT operations.
  
__GET_RETURNED_FORMAT__:  
  
```
"user": {
	"userId": "String",
	"dateOfCreation": "String",
	"dateOfLastUpdate": "String",
	"credentials": {
		"surname": "String",
		"firstname": "String",
		"birthDate": "String",
		"mail": "String",
	},
	"communities": ["communityId", "communityId"],
	"profile": {
		"communityId": "communityId",
		"photo": "pathToImage",
		"username": "String",
		"isAdmin": "Integer"
	}
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
```
  
The only differences with a query to /users/id are:  
- the profile is not an arry, but an object containing only the profile og the relevant community.  
- the passions filed is an array of the passions related to the community only. All other passions have been filtered out.  
- - the skills field is an array of the skills related to the community only. All other skills have benn filtered out.  
- The events field only contains the events of this community only. All other events of other communities have benn filtered out. The same goes to passedEvents.  
  
__POST AND PUT EXPECTED FORMAT__:  
  
```
"user": {
	"userId": "String",
	"credentials": {
		"surname": "String",
		"firstname": "String",
		"birthDate": "String",
		"mail": "String",
	},
	"communities": ["communityId", "communityId"],
	"profile": {
		"communityId": "communityId",
		"photo": "pathToImage",
		"username": "String",
		"isAdmin": "Integer",
	}
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
```
As always, to complety remove all the elements of a field, you must pass an empty object to the  field. ex: "skills": "{}'  
If you pass an empty array to the field containing, or if the field is omitted, then nothing will be changed.  
The only mandatory field is the userId one. All other fields are optionnal.  
In the case of array, the new array will be appended to the one in the database. All duplicates will be kept, so it's up to you to ensure there is none before querying the database.  
  
  
## /users/id/communityId/skills
  
__ROUTE__:  
/users/id/communityId/skills  
  
__USAGE__:  
This route is only used to access the skills of a user for a specific community. All other fields are considered irrelevant. The idea is to minimize as much as possible the work on the client side by moving it to the server side. It's up to the server to filter the user document to get only those data.
  
  __SUPPORTED FORMATS__:  
    
This route only supports the json format, both for GET and POST requests.
  
  __CRUD OPERATIONS__:  
  
This route supports GET, POST and PUT operations.  
  
__GET RETURNED FORMAT__:  
  
```
"user": {
	"userId": "String",
	"dateOfCreation": "String",
	"dateOfLastUpdate": "String",
	"skills": ["skilId", "skillId"]
}
```
  
The skills are filtered out. Only the skills relevant to the community are returned.  
  
__POST AND PUT EXPECTED FORMAT__:  
  
This will be the same as POST in /users

```
"user": {
	"userId": "String",
	"skills": ["skilId", "skillId"]
}
```
The array of skills will be appended to the one in the database. All duplicates will be kept, so it is up to you to ensure there is no duplicate in the array.  
As always, to complety remove all the elements of the array, you must pass an empty object to the "skills" field. ex: "skills": "{}'  
If you pass an empty array to the "skills" field, or if the field is omitted, then nothing will be changed.  
  
## /users/id/communityId/passions
  
  __ROUTE__:  
/users/id/communityId/passions  
  
__USAGE__:  
This route is used to GET, the passions of a user specific to a community. It is also used to update them with a PUT request or to add the field "passions" if there is none using the POST request.  
  
  __SUPPORTED FORMATS__:  
  
This route only supports the json format for all requests.  
We can expand it later on if necessary.  
  
__CRUD OPERATIONS__  
This route supports GET, POST and PUT operations.  
  
  __GET RETURNED FORMAT__:  
  
```
"user": {
	"userId": "String",
	"pasisons": [passionId", "passionId"]
}
```
	
  __POST AND PUT EXPECTED FORMAT__:  
    
```
"user": {
	"userId": "String",
	"pasisons": [passionId", "passionId"]
}
```
The array of passions will be appended to the one in the database. All duplicates will be kept, so it is up to you to ensure there is no duplicate in the array.  
As always, to complety remove all the elements of the array, you must pass an empty object to the "passions" field. ex: "passions": "{}'  
If you pass an empty array to the "passions" field, or if the field is omitted, then nothing will be changed.  
  
## /users/id/communityId/currentEvents
  
__ROUTE__:  
  
/users/id/communityId/currentEvents  
  
__USAGE__:  
  
This route enables us to retrieve only the currentEvents specific to user for a specific community. If the user is part of multiple communities, only the currentEvents of the community whose Id is specified in the route will be used.  
  
__CRUD OPERATIONS__:  
  
This route supports GET, POST and PUT operations.
  
__GET_RETURNED_FORMAT__:  
  
```
"user": {
	"userId": "String",
	"currentEvents": {
		"eventsICreated": ["eventId", "eventId"],
		"eventsIParticipate": ["eventId", "eventId", "eventId", "eventId"]
	}
}
```
  
__POST AND UPDATE EXPECTED FORMAT__:  
  
```
"user": {
	"userId": "String",
	"currentEvents": {
		"eventsICreated": ["eventId", "eventId"],
		"eventsIParticipate": ["eventId", "eventId", "eventId", "eventId"]
	}
}
```
  
The only required field is the userId. All other fields are optional.  
If the currentEvents field is omitted, nothing will change. If the eventICreated or/and the eventIParticipate are omitted or empty arrays, nothing will change.  
All valeus passed to the eventICreated and/or eventIParticipate will be appended to the correpsonding field.
As always, to complety remove all the elements of the array, you must pass an empty object to the  field. ex: "eventiCreated": "{}'. This will completly remove the corresponding field.  
  
##  /users/id/communityId/passedEvents
  
__ROUTE__:  
  
/users/id/communityId/passedEvents  
  
__USAGE__:  
  
This route is used only to retrieve the passed events of a user for a specific community.  
Only passed events are of interest. All other fields will be filtered out.  
The idea is to give as few work possible to the client, and let the server do the heavy work.  
  
__SUPORTED FORMATS__:  
  
  This route only supports the json format, for GET, POST and PUT requests.  
  
__CRUD OPERATIONS__:  
  
This route supports GET, POST and PUT requests.  
  
__GET RETURNED FORMAT__:  
  
```
"user": {
	"userId": "String",
	"passedEvents": {
		"PassedevenementsICreated": ["eventId", "eventId"],
		"PassedEvenementsParticipated": ["eventId", "eventId", "eventId"]
	}
}
```
  
__POST AND PUT EXPECTED FORMAT__:  
  

```
"user": {
	"userId": "String",
	"passedEvents": {
		"passedEventsICreated": ["eventId", "eventId"],
		"passedEventsIParticipated": ["eventId", "eventId", "eventId"]
	}
}
```
The only required field is the userId. All other fields are optional.  
If the passedEvents field is omitted, nothing will change. If the passedEventICreated or/and the passedEventIParticipate are omitted or empty arrays, nothing will change.  
All valeus passed to the passedEventICreated and/or passedEventIParticipate will be appended to the correpsonding field.
As always, to complety remove all the elements of the array, you must pass an empty object to the  field. ex: "passedEventICreated": "{}'. This will completly remove the corresponding field.  
## /passions
  
__ROUTE__:  
  
/passions  
  
__USAGE__:  
  
This route is used to query all the passions in the habee database, no matter their community.   
__SUPPORTED FORMATS__:  
  
  This route only supports the json format.  
    
__CRUD OPERATIONS__:  
  
This route supports GET, POST and PUT operations.  
  
__GET RETURNED FORMAT__:  
  
```
"passions": "{
	"allPassions": [
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
		},
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
	]
}
```
A GET request ti this route returns an array of passions.  
  
__POST EXPECTED FORMAT__:  
  
```
"passions": "{
	"allPassions": [
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
		},
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
	]
}
```
You should pass a "passion" object, containg an array "allPassions", containg all the passions you whish to update.  
For each passion:  
The only required field is the passionId. All other fields are optional.  
If a field is omitted, it will not change. If an empty array is passed to a field containing an array, nothing will change.  
All values passed to an array will be appended to an array. Duplicates will be kept, so it is iup to you to ensure there is none.  
As always, to complety remove all the elements of the array, you must pass an empty object to the  field. ex: "subPassions": "{}'. This will completly remove the corresponding field.  
To remove the value of a field, you must pass it an empty object. For exemple: "passionImage": "{}".  
  
## /skills
  
__ROUTE__:  
  
/skills  
  
__USAGE__:  
  
This route is used to list all skills, no matter the user they blong to and the community the user is from.   
  
__SUPPORTED FORMATS__:  
  
This route only supports the json format.  
  
__CRUD OPERATIONS__:  
  
This route supports GET, POST and PUT operations.  
  
__GET RETURNED FORMAT__:  
  
```
"skills": {
	"skills": [
		"skill" : {
			"skillId": "String",
			"skillForUser": "userId",
			"userCommunity": "communityId",
			"skillName": "name",
			"skillImage": "pathToImage",
			"skillMastery": "String",
			"dateOfCreation": "String",
			"dateOfLastUpdate": "String"
		},
		"skill" : {
			"skillId": "String",
			"skillForUser": "userId",
			"userCommunity": "communityId",
			"skillName": "name",
			"skillImage": "pathToImage",
			"skillMastery": "String",
			"dateOfCreation": "String",
			"dateOfLastUpdate": "String"
		}
	]
}
```
  
__POST AND PUT EXPECTED FORMAT__:  
  
```
"skills": {
	"skills": [
		"skill" : {
			"skillId": "String",
			"skillForUser": "userId",
			"userCommunity": "communityId",
			"skillName": "name",
			"skillImage": "pathToImage",
			"skillMastery": "String",
			"dateOfCreation": "String",
			"dateOfLastUpdate": "String"
		},
		"skill" : {
			"skillId": "String",
			"skillForUser": "userId",
			"userCommunity": "communityId",
			"skillName": "name",
			"skillImage": "pathToImage",
			"skillMastery": "String",
			"dateOfCreation": "String",
			"dateOfLastUpdate": "String"
		}
	]
}
```
In case of a POST request, you should pass an array of skills you whish to add to to the database as documents. Each skill in the array in the field "skills" will be a new document.  
The required fields are skillId, skillname, skillForUser (a skill must be related to a user), skillCommunity (the community of the user who has the skill), and the skillMastery (the level of mastery reached by the user on this specfic skill).  
In case of a PUT request: the only necessary skill in each element of the "skills" field is the "skillId". The server will iterate through the array "skills" and update each skill based on their skillId.  
A field whithout a value wont be updated. A new value will replace the current one. To delete a value, you must replace if by an empty object. Exemple: "skillImage": "{}".  
  
##  /skills/communityId
  
__ROUTE__:  
  
/skills/communityId  
  
__USAGE__:  
  
This route returns all the skills in a given community.  
  
__SUPPORTED FORMATS__:  
  
This route only supports the JSON format.  
  
__CRUD OPERATIONS__:  
  
This route supports the GET operation.  
  
__GET RETURNED FORMAT__:  
  
  ```
"skillsForCommunity": {
	"communityId": "String",
	"nbrOfSkills": "Integer",
	"skills": [
		"skill" : {
			"skillId": "String",
			"skillForUser": "userId",
			"userCommunity": "communityId",
			"skillName": "name",
			"skillImage": "pathToImage",
			"skillMastery": "String",
			"dateOfCreation": "String",
			"dateOfLastUpdate": "String"
		},
		"skill" : {
			"skillId": "String",
			"skillForUser": "userId",
			"userCommunity": "communityId",
			"skillName": "name",
			"skillImage": "pathToImage",
			"skillMastery": "String",
			"dateOfCreation": "String",
			"dateOfLastUpdate": "String"
		}
	]
}
```
  
# /events
  
__ROUTE__:  
  
/events  
  
__USAGE__:  
  
  This route is used to interact with all the events in the Habee database, current and passed, no matter the community they take place in.  
    
__SUPPORTED FORMATS__:  
  
This route only supports the json format.  
  
__CRUD OPERATIONS__:  
  
This route only supports the GET operation.  
  
