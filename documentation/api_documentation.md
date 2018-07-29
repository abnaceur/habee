# API documentation

The API exposed by the node server will follow as much as possible the REST principles.  
However, the flexibility and ease of use of the API is more important to us than perfectly folowing the rigid principles behind the REST convention.  
  
This api contains a lot of differents routes, more than what would seem necessary. However, having so many routes enable us to move the working load from the user to the server. The server will do the calculation faster. It also helps the user to retrieve only necessary informations: it is useless to retrieve all the profiles of a user if the only necessary profile is the one of one community only.  

## Principles of REST API:  
  
	- Ressources are used to identify data, not actions nor files.   
	- HTTP verbs are the action to be executed on the ressources. It should no be contained in the URI.  
	- A URI can serve data in different formats. The format is determined by the "content negociation" method, which uses __ACCEPT__ headers in HTPP requests.  
	- A human must be able to understand what a URI is serving, whithout having to read the documentation.  
	- Returned ressources must reference other ressources by their URI, not by their name. Thus, any user can immediatly query those ressources.
  
As said above, we should not follow those rules religiously. Developper experience (ease of use) is more important than a perfectly REST API.
  
## Rules relative to API developement  
  
Each route must be thoroughly documented. Documentation __must__ best exhaustive.  
In particular, documentation must contain:
	- The URI used to retrieve the ressource  
	- The supported returned format (json, html, raw text, etc...), with an exemple for each format.  
	- A description of the data.
	- The supported HTTP methods (GET, POST, etc..) and the authentication level necessary for each one of them  

## Routes

/communities										GET/POST
/communities/id										GET/POST/UPDATE
/communities/active									GET
/communities/isNotActive							GET

/users												GET/POST
/users/isNotActive									GET
/users/isActive										GET
/users/administrators								GET
/users/notAdmin										GET
/users/id											GET/POST
/users/id/credentials								GET/POST/UPDATE
/users/id/communityId/profile						GET/POST/UPDATE
/users/id/communityId/profile/skills				GET/POST/UPDATE
/users/id/communityId/profile/passions				GET/POST/UPDATE
/users/id/communityId/profile/currentEvents			GET/POST/UPDATE
/users/id/communityId/profile/passedEvents			GET/POST/UPDATE

/passions											GET/POST
passions/passionId									GET/POST/UPDATE
/passions/communityId								GET

/skills												GET
/skills/communityId									GET

/events												GET/POST
/events/isOver										GET
/events/isNotOver									GET
/events/communityId									GET
/events/communityId/isOver							GET/UPDATE
/events/communityId/isNotOver						GET/UPDATE

#### /communities

ROUTE:  
/communities  
  
USAGE:   
This route is used to get all the communities on Habee, and to post new communities.  
  
DESCRIPTION OF THE RESSOURCE:  
This ressources contains a list of all the communities. Each community contains its name, its communityId, the number of members, the date of creation.It also contains the status of the community: active or not.  
It does no list all the users since it is supposed to offer an overview of all the communities in Habee. To have a list of all the users, you must do a GET query to /users  
  
RETURNED FORMAT:  
This ressource is only returned using the json format.  
We can look to expand the avaible format later on, if necessary.  
  
CRUD:  
Crud operations that necessitate to create a new community must be made on this route. In that case, the query must be a POST query, with a body with JSON format containing the following informations:  
POST REQUEST EXPECTED FORMAT:  
`
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
`
GET REQUEST RETURNED FORMAT:  
The ressource contains only two entries, the number of community and an array containing multiple community objects.  
`
"communities": {  
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
`
  
Then, it will be up to the server to check the validity of this community,. The server will also accept the community if everything is ok, and reject it if there is a problem (communityId already exists, etc...)
The logo picture will be given by the client and stored on a specific file on the server. The update of the communityLogo field is made by a POST request on community/id

#### /communities/id

ROUTE:  
/communities/id  
  
USAGE:  
This ressource is used to access data specific to one community: the community of id: id. The communityId is avaible in pretty much any ressource, and thus is accessbile at almost any time whithout additionnal request.  
This ressource contains the communityId, its name, the list of administrators, the list of members, the dateOfCreation and the dateOfLastUpdate, the name of the company responsable for this community. It also contains the status of the community: active or not.
  
SUPPORTED FORMATS:  
This ressource is only returned using the json format.  
We can look to expand the avaible format later on, if necessary.  
  
GET REQUEST RESULT FORMAT:  
`
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
`

#### /communities/active

ROUTE:  
/communities/active  
  
USAGE:  
This ressource answers to a GET request and list all active communities.  
  
DESCRIPTION OF THE RESSOURCE:  
This ressource is used to give a list of all communities whose communityIsActive field has the value active.
This ressource contains a single filed, containing an array of objects representing communities.Thoses community objects contain the communityId, the communityName, the nbrOfMembers of the community and the date of creation.
  
SUPPORTED FORMAT:  
This ressource is only returned using the json format.  
We can look to expand the avaible format later on, if necessary.  
  
GET REQUEST RESULT:  
`
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
`
  
#### /communities/isNotActive
  
ROUTE:  
/communities/isNotActive  
  
DESCRIPTION OF THE RESSOURCEE:  
This ressource answers to a GET request and list all inactive communities.  
  
USAGE:  
This ressource is used to give a list of all communities whose communityIsActive filed has the value inactive.  
This ressource contains a single filed, containing an array of objects representing communities.Thoses community objects contain the communityId, the communityName, the nbrOfMembers of the community and the date of creation.
  
SUPPORTED FORMAT:  
This ressource is only returned using the json format.  
We can look to expand the avaible format later on, if necessary.  
  
DATA:  
Exactly the same format as /community/active  
  
### /users
  
ROUTE:  
/users  
  
DESCRIPTION OF THE RESSOURCE:  
This ressource is used to get the list of all users in the database, and to add new users to it with a post request.  
  
USAGE:  
This ressource is used to retrieve a list of all users. All users in the habee database will be listed, no matter their community. For this very reason, the data avaible for each user will be limited.  
  
SUPPORTED FORMAT:  
This ressource is only returned using the json format.  
We can look to expand the avaible format later on, if necessary.  
  
CRUD:  
This ressource supports the following http operations: GET & POST.
  
GET REQUEST RESULT:  
This ressource contains two fields: the number of users in the database, and an array of user objects.  
`
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
`
  
POST REQUEST EXPECTED FORMAT:  
This is the minimum data expected to add a new user in the database.  
All fields in the user datamodel can be filled, but only those ones are necessary for the creation of a new user.  
`
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
`
  
### /users/active
  
ROUTE:  
/users/active
  
USAGE:  
This ressource is used to access all the active users, from all the database, no matter the community.  
For this very reason, the amount of data avaible for each user will be limited.  
  
CRUD OPERATIONS:  
This route only answers to GET requests.
  
GET RETURNED FORMAT:  
This ressource is only returned using the json format.
The returned data format is the same as the returned data from a GET request to the /users route.  
  
### /users/isNotActive
  
ROUTE:  
/users/isNotActive
  
USAGE:  
This ressource is used to access all the inactive users, from all the database, no matter the community.  
For this very reason, the amount of data avaible for each user will be limited.  
  
CRUD OPERATIONS:  
This route only answers to GET requests.
  
GET RETURNED FORMAT:  
This ressource is only returned using the json format.
The returned data format is the same as the returned data from a GET request to the /users route.  
  
### /users/administrators
  
ROUTE:  
/users/administrators
  
USAGE:  
This ressource is used to access all the users whose role is administrator, from all the database, no matter the community.  
For this very reason, the amount of data avaible for each user will be limited.  
  
CRUD OPERATIONS:  
This route only answers to GET requests.
  
GET RETURNED FORMAT:  
This ressource is only returned using the json format.
The returned data format is the same as the returned data from a GET request to the /users route.  
  
### /users/notAdmin
  
ROUTE:  
/users/notAdmin
  
USAGE:  
This ressource is used to access all the users who do not have an administrator role, from all the database, no matter the community.  
For this very reason, the amount of data avaible for each user will be limited.  
  
CRUD OPERATIONS:  
This route only answers to GET requests.
  
GET RETURNED FORMAT:  
This ressource is only returned using the json format.
The returned data format is the same as the returned data from a GET request to the /users route.  
  
### /users/id
  
ROUTE:  
/users/id  
  
USAGE:  
This ressource is used to access a spceific user, specified by its userId.  
This route answers to both GET and POST requests.  
  
SUPPORTED FORMATS:  
This route  C PAS FINI LOL
