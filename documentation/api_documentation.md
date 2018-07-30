# API documentation

The API exposed by the node server will follow as much as possible the REST principles.  
However, the flexibility and ease of use of the API is more important to us than perfectly folowing the rigid principles behind the REST convention.  
  
This api contains a lot of differents routes, more than what would seem necessary. However, having so many routes enable us to move the working load from the user to the server. The server will do the calculation faster. It also helps the user to retrieve only necessary informations: it is useless to retrieve all the profiles of a user if the only necessary profile is the one of one community only.  

## Principles of REST API:  
	* Ressources are used to identify data, not actions nor files.
	* HTTP verbs are the action to be executed on the ressources. It should no be contained in the URI.
	* A URI can serve data in different formats. The format is determined by the "content negociation" method, which uses ACCEPT headers in HTPP requests.
	* A human must be able to understand what a URI is serving, whithout having to read the documentation.
	* Returned ressources must reference other ressources by their URI, not by their name. Thus, any user can immediatly query those ressources.
  
As said above, we should not follow those rules religiously. Developper experience (ease of use) is more important than a perfectly REST API.
  
## Rules relative to API developement  
  
Each route must be thoroughly documented. Documentation __must__ be exhaustive.  
In particular, documentation must contain:  
	* The URI used to interact with the ressource  
	* The supported returned format (json, html, raw text, etc...) to a GET request, with an exemple for each format, and the required POST/PUT format.  
	* A description of the data.  
	* The supported HTTP methods (GET, POST, etc..) and the authentication level necessary for each one of them  

## ROUTES

<pre>
/communities                                        GET/POST  
/communities/id                                     GET/POST/UPDATE  
/communities/active                                 GET  
/communities/isNotActive                            GET  
  
/users                                              GET/POST  
/users/isNotActive                                  GET  
/users/isActive                                     GET  
/users/administrators                               GET  
/users/notAdmin                                     GET  
/users/id                                           GET/POST  
/users/id/credentials                               GET/POST/UPDATE  
/users/id/communityId/profile                       GET/POST/UPDATE  
/users/id/communityId/profile/skills                GET/POST/UPDATE  
/users/id/communityId/profile/passions              GET/POST/UPDATE  
/users/id/communityId/profile/currentEvents         GET/POST/UPDATE  
/users/id/communityId/profile/passedEvents          GET/POST/UPDATE  
  
/passions                                           GET/POST  
/passions/passionId                                 GET/POST/UPDATE  
/passions/communityId                               GET  
  
/skills                                             GET  
/skills/communityId                                 GET  
  
/events                                             GET/POST  
/events/isOver                                      GET  
/events/isNotOver                                   GET  
/events/communityId                                 GET  
/events/communityId/isOver                          GET/UPDATE  
/events/communityId/isNotOver                       GET/UPDATE  
</pre>
  
## /communities
  
__ROUTE__:  
/communities  
  
__USAGE__:   
This route is used to get all the communities on Habee, and to post new communities.  

__SUPPORTED OPERATION__:  
GET and POST.  
  
__DESCRIPTION OF THE RESSOURCE__:  
This ressources contains a list of all the communities. Each community contains its name, its communityId, the number of members, the date of creation.It also contains the status of the community: active or not.  
It does no list all the users since it is supposed to offer an overview of all the communities in Habee. To have a list of all the users, you must do a GET query to /users  
  
__SUPPORTED FORMAT__:  
This ressource only supports the json format.  
We can look to expand the avaible format later on, if necessary.  
  
__CRUD__:  
crud operations that necessitate to create a new community must be made on this route. In that case, the query must be a POST query, with a body with JSON format containing the following informations:  
__POST REQUEST EXPECTED FORMAT__:  
<pre>
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
</pre>
__GET REQUEST RETURNED FORMAT__:  
The ressource contains only two entries, the number of communities and an array containing multiple community objects.  
<pre>
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
</pre>
  
Then, it will be up to the server to check the validity of this community,. The server will accept the community if everything is ok, and reject it if there is a problem (communityId already exists, etc...)
The logo picture will be given by the client and stored on a specific file on the server. The update of the communityLogo field is made by a POST request on community/id

## /communities/id

__ROUTE__:  
/communities/id  
  
__USAGE__:  
This ressource is used to access data specific to one community: the community of id: id. The communityId is avaible in pretty much any ressource, and thus is accessbile at almost any time whithout additionnal request.  
This ressource contains the communityId, its name, the list of administrators, the list of members, the dateOfCreation and the dateOfLastUpdate, the name of the company responsable for this community. It also contains the status of the community: active or not.
  
__SUPPORTED OPERATION__:  
GET.  
  
__SUPPORTED FORMAT__:  
This ressource is only returned using the json format.  
We can look to expand the avaible format later on, if necessary.  
  
__GET REQUEST RESULT FORMAT__:  
<pre>
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
</pre>

## /communities/active

__ROUTE__:  
/communities/active  
  
__USAGE__:  
This ressource answers to a GET request and list all active communities.  
  
__SUPPORTED OPERATION__:  
GET.  
  
__DESCRIPTION OF THE RESSOURCE__:  
This ressource is used to give a list of all communities whose communityIsActive field has the value active.
This ressource contains 2 fileds, the number of active communities, and an array of objects representing communities.Thoses community objects contain the communityId, the communityName, the nbrOfMembers of the community and the date of creation.
  
__SUPPORTED FORMAT__:  
This ressource is only returned using the json format.  
We can look to expand the avaible format later on, if necessary.  
  
__GET REQUEST RESULT FORMAT__:  
<pre>
"communities": {  
	"activeCommunities": "Integer",
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
</pre>
  
## /communities/isNotActive
  
__ROUTE__:  
/communities/isNotActive  
  
__DESCRIPTION OF THE RESSOURCE__:  
This ressource answers to a GET request and list all inactive communities.  
  
__SUPPORTED OPERATION__:  
GET.  
  
__USAGE__:  
This ressource is used to give a list of all communities whose communityIsActive filed has the value inactive.  
This ressource contains 2 fileds, the number of incative communities, and an array of objects representing communities.Thoses community objects contain the communityId, the communityName, the nbrOfMembers of the community and the date of creation.
  
__SUPPORTED OPERATION__:  
GET.  
  
__SUPPORTED FORMAT__:  
This ressource is only returned using the json format.  
We can look to expand the avaible format later on, if necessary.  
  
__DATA__:  
Exactly the same format as /community/active  
  
## /users
  
__ROUTE__:  
/users  
  
__DESCRIPTION OF THE RESSOURCE__:  
This ressource is used to get the list of all users in the database, and to add new users to it with a post request.  
  
__SUPPORTED OPERATION__:  
GET and POST.  
  
__USAGE__:  
This ressource is used to retrieve a list of all users. All users in the habee database will be listed, no matter their community. For this very reason, the data avaible for each user will be limited. It is also used to add new users to the database.  
  
__SUPPORTED FORMAT__:  
This ressource only supports the json format.  
We can look to expand the avaible format later on, if necessary.  
  
__CRUD__:  
This ressource supports the following http operations: GET & POST.
  
__GET REQUEST RESULT FORMAT__:  
This ressource contains two fields: the number of users in the database, and an array of user objects.  
<pre>
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
</pre>
  
__POST REQUEST EXPECTED FORMAT__:  
This is the minimum data expected to add a new user in the database.  
All fields in the user datamodel can be filled, but only those ones are necessary for the creation of a new user.  
<pre>
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
</pre>
  
## /users/active
  
__ROUTE__:  
/users/active
  
__USAGE__:  
This ressource is used to access all the active users, from all the database, no matter the community.  
For this very reason, the amount of data avaible for each user will be limited.  
  
__CRUD__ __OPERATIONS__:  
This route only answers to GET requests.
  
__GET RETURNED FORMAT__:  
This ressource is only returned using the json format.
The returned data format is the same as the returned data from a GET request to the /users route.  
  
## /users/isNotActive
  
__ROUTE__:  
/users/isNotActive
  
__USAGE__:  
This ressource is used to access all the inactive users, from all the database, no matter the community.  
For this very reason, the amount of data avaible for each user will be limited.  
  
__CRUD__ __OPERATIONS__:  
This route only answers to GET requests.
  
__GET RETURNED FORMAT__:  
This ressource is only returned using the json format.
The returned data format is the same as the returned data from a GET request to the /users route.  
  
## /users/administrators
  
__ROUTE__:  
/users/administrators
  
__USAGE__:  
This ressource is used to access all the users whose role is administrator, from all the database, no matter the community.  
For this very reason, the amount of data avaible for each user will be limited.  
This can be used to inform administrators of all communities about news related to habee, new rules, etc...
  
__CRUD__ __OPERATIONS__:  
This route only answers to GET requests.
  
__GET RETURNED FORMAT__:  
This ressource is only returned using the json format.
The returned data format is the same as the returned data from a GET request to the /users route.  
  
## /users/notAdmin
  
__ROUTE__:  
/users/notAdmin
  
__USAGE__:  
This ressource is used to access all the users who do not have an administrator role, from all the database, no matter the community.  
For this very reason, the amount of data avaible for each user will be limited.  
  
__CRUD__ __OPERATIONS__:  
This route only answers to GET requests.
  
__GET RETURNED FORMAT__:  
This ressource is only returned using the json format.
The returned data format is the same as the returned data from a GET request to the /users route.  
  
## /users/id
  
__ROUTE__:  
/users/id  
  
__USAGE__:  
This ressource is used to access a spceific user, specified by its userId.  
This route answers to both GET and POST requests.  
  
__SUPPORTED FORMAT__S:  
This __ROUTE__  C PAS FINI LOL
