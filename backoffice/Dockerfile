FROM node:latest
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app/
RUN npm install nodemon -g
RUN npm install
COPY . /usr/src/app
EXPOSE 3000
CMD DEBUG=backoffice:* npm run devstart