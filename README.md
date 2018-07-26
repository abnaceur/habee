# Habee repository

## Git flow
There are three branches:
 - Master
 - Staging
 - Dev

The *Master* branch is used for production. Only the features we know are perfectlyworking should be merged on *Master*
The *Staging* bracnh is made for test purposes. Once a feature is developed, it is merged on *Staging*.
The *Dev* branch is where new features are developped.

We will use a strategy of *continuous integration*: the code is merged on its mother branch multiple times a day. This will
help prevent what is known as "the merge hell". It will greatly improve the speed of developement and make development seamless.
We will also use a continuous *delivery workflow*, where the code on themaster branch is always ready for deployment.

## Git Commit messages guidlines

Commit messages should conform to the following rules:
	- Title in capital letters
	- The title is separated from the body of the message by one empty line
	- A line should not be longer than 80 characters
	- The message must focus on the WHY and WHAT, not HOW.

This template can be used for the commit messages:

`
COMMIT MESSAGE TITLE

Here, I explain WAT I did (the improvements I made to the code, what I removed
from it, etc...)
I alos explain WHY I did it.
`
