FROM ubuntu:16.04

#Maintainer Abdeljalil NACUER - abnaceur@student.42.fr

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app/

#BASIC STUFF
RUN apt-get update \
    && apt-get install -y python-software-properties software-properties-common build-essential git wget curl unzip ruby \
    && curl -sL https://deb.nodesource.com/setup_8.x -o nodesource_setup.sh \
    && bash nodesource_setup.sh \
    && apt-get install -y nodejs \
    && npm install -g npm \
    && npm install -g cordova \ 
    && npm install -g ionic \
    && npm rebuild node-sass --force

EXPOSE 8100
CMD ionic serve --browser