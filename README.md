HABEE PROJECT
=========================

## Description of the project :

Habee is a hybrid plateform for enterprise to leverage the human wellbeing
and make the professional environement a pleasnat place to be in.

## Team 
 - Marie
 - Amelie
 - Mathias
 - Jerome
 - Abdeljalil : http://naceur-abdeljalil.com

## Project's Goals and objectives

Create a platform for the human ressources personnal to add emplyee, publish and orgnize events, in an easy and a fast way.

A mobile application IOS/Android/Widows for employees to subscrib to events,
add/share their skills, passion with otehr members.

## Technologies :
 - IONIC 3
 - Nodejs v10.7.0
 - Docker 17.12.1-ce
 - Bootstrap 4

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

Navigate to frontoffice

```bash
cd frontoffice
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

Navigate to the backoffice

```bash
cd ../backoffice
```

install the dependencies

```bash
# you may need to use sudo
npm install
```

```bash
# Build the project
docker-compose up --build
```

Note: the port 80 must not be used by another application (like Apache or Skype).

P.S: The build may take some time don't worry be happy and grab a cup of tea :)

### List of links

```bash
si.habee.local -> backend ( REST API )
app.habee.local -> frontend
app.habeedb.local:3300 -> mongoclient
```

### Help

To generate the bundler in app folder :
```bash
make build
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