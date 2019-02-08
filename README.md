HABEE PROJECT
=========================

## Description of the project :

Habee is a hybrid plateform for enterprise to leverage the human wellbeing
and make the professional environement a pleasnat place to be in.

## Team 
 - Marie
 - Amelie
 - Abdeljalil : http://naceur-abdeljalil.com

## Project's Goals and objectives

Create a platform for the human ressources personnal to add emplyee, publish and orgnize events, in an easy and a fast way.

A mobile application IOS/Android/Widows for employees to subscrib to events,
add/share their skills, passion with otehr members.

## Technologies :
 - IONIC 3
 - Angular 5
 - Nodejs v10.7.0
 - MongoDB
 - Docker 17.12.1-ce
 - Bootstrap 4
 - JQuery

## Screenshots

## Git flow
There are three branches:
 - Master - origin
 - Staging - follow master
 - Develop - follow staging

The *Master* branch is used for production. Only the features we know are perfectly working should be merged on *Master*  
The *Staging* branch is made for testing purposes. Once a feature is developed, it is merged on *Staging*.  
The *Dev* branch is where new features are developped.

We will use a strategy of *continuous integration*: the code is merged on its mother branch multiple times a day. This will help prevent what is known as "the merge hell".  
It will greatly improve the speed of developement and make development seamless.  
We will also use a continuous *delivery workflow*, where the code on the master branch is always ready for deployment.  

## Git Commit messages guidlines

Commit messages should conform to the following rules:  
	- Title in capital letters  
	- The title is separated from the body of the message by one empty line  
	- A line should not be longer than 80 characters  
	- The message must focus on the WHY and WHAT, not HOW.  
  
This template can be used for the commit messages:  

> COMMIT MESSAGE TITLE
> 
> Here, I explain WHAT I did (the improvements I made to the code, what I removed
> from it, etc...)
> I alos explain WHY I did it.
  
A template ready for usage is also avaible in the *misc* floder, at the root of the repo.  

## Install the development environment

Get the source:

```bash
git clone https://me-me@bitbucket.org/habee2/habee.git
```

Edit your `/etc/hosts` file:

```
127.0.0.1   si.habee.local
127.0.0.1   app.habee.local
127.0.0.1   app.habeedb.local
```

## Build the project

Navigate to frontend

```bash
cd frontend
```

install the dependencies

```bash
# you may need to use sudo
npm install
```

P.S : you may face permission access limitation caused in installing node-sass
don't panic and execute the following two command 

```bash
# Fix the permission problem
npm config set user 0
npm config set unsafe-perm true
```


Navigate to the backend

```bash
cd ../backend
```

install the dependencies

```bash
# you may need to use sudo
npm install
```

Copy the .env file in the backend

```bash
# environment variables
cp .env-template .env
```
Go back to the root folder and build the project

```bash
# Build the project
docker-compose up --build
```

Note : the port 80 must not be used by another application (like Apache or Skype).

P.S : The build may take some time don't worry be happy and grab a cup of tea :)

P.S : If you face a "missing node-sass module in usr/app" issue then 
stop docker and follow this steps
```bash
a. In frontend/Dockerfile -> comment line 18 and delet '\' at the end of line 17
b. in docker-compose.yml line 56 add this line of code
command: npm rebuild node-sass --force

Once the build finish and the node-sass has been rebuilt
stop your docker sontainer and :

a. In frontend/Dockerfile -> uncomment line 18 and add '\' at the end of line 17
b. in docker-compose.yml delete line 56

Start your docker : docker-compose up

```

Now restart docker 
```bash
docker-compose up 
```
If the error presist plaese contact : contact@naceur-abdeljalil.com
s
### List of links

```bash
si.habee.local:3000 -> backend ( REST API )
app.habee.local:8100 -> frontend
app.habeedb.local:3300 -> mongoclient
```

### Database connection

- Navigate to : app.habeedb.local:3300
- Create a new connection :
	- Connection Name (Optional) : Habeedb
	- Host/Port : 192.168.213.1
	- Database name : habeedb

## Frontend :

Commands and plagins to install

```bash
npm i -g ionic cordova
sudo ionic cordova platform add android --save
sudo npm install @ionic-native/social-sharing
ionic cordova plugin add cordova-plugin-camera
ionic cordova plugin add cordova-plugin-file-transfer
ionic cordova plugin add cordova-plugin-file

```


### Contributors
 - Mathias -> 	- Data model v0.0.
				- API documentation v0.0.
				- Base tab navigation in frontend.
	
 - Jerome -> 	- Team building.
				- Marketing strategy beta version.

### Help

If you face an error with mongdb while running docker related to repair database
stop your docker and do the following :

```bash
In docker-compose line 46 add :
command: mongod --repair
start your docker.
Once the build finish and the database has been repaired
stop your docker sontainer and delete the line of code number 46
and start your docker.
```



If you face this error message in backend "no space left"
the stop docker and execute this command :

```bash
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
```
Explanation :

```bash
 echo fs.inotify.max_user_watches=524288 it increase the number of watches of nodemon as you made some changes in your project and sudo tee -a /etc/sysctl.conf && sudo sysctl -p is sysctl command for configure kernel parameters at runtime
```

if you face this error message :
"Error: /usr/lib/x86_64-linux-gnu/libstdc++.so.6: version `CXXABI_1.3.9' not found (required by /usr/src/app/node_modules/bcrypt/lib/binding/bcrypt_lib.node)"

Cause : bcrypt is lib is not compatible.
Solution : To avoid this error do the following

```bash
# Connect to your container backend
docker exec -ti habee_backend_dev  bash

# Delete node_modules
rm -rf node_modules

# Re-install the packages
npm install
```

Start webpack in watch mode
```bash
# Install all dependencies.
make watch
```

Stop and remove all containers

```bash
docker stop $(docker ps -a -q)
```

Connect to a container via bash (get the container name you want to connect to via command `docker ps`)
```bash
docker exec -ti containername bash
```

Execute a command directly in a container without connecting in bash (get the container name you want to connect to via command `docker ps`)

```bash
docker exec -i containername yourcommand
```

Delete all inages 

```bash
docker rmi -f $(docker images -q)
```

Show images 

```bash
docker images
```