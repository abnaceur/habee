FROM node:latest

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

RUN npm install -g maildev

EXPOSE 80 4444

CMD ["maildev", "--web", "80", "--smtp", "4444"]