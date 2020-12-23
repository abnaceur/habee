const faker = require('faker');
const fs = require('fs');
const User = require("../../models/user");
let mongoose = require('mongoose');
const bcrypt = require('bcrypt');

async function creatNewAccountUser () {
    let email = faker.internet.email();
    let password = "1658oqhi8fkW8MC87$";

    let userIdGen = email.substring(0, email.search('@')) + '_' + Math.floor(Math.random() * 10000) + '_' + email.substring(email.search('@'), email.lenght);
    let communityId = email.substring(0, email.search('@')) + Math.floor(Math.random() * 10000);
    let profileAvatar = Math.floor(Math.random() * 35) + 1;
    let firstname = faker.name.firstName();
    let lastname = faker.name.lastName();

    return new Promise((resolve, reject) => {

        bcrypt.hash(password, 10, (err, hash) => {

            resolve({
                _id: new mongoose.Types.ObjectId,
                userId: userIdGen,
                activeCommunity: communityId,
                activeProfileRole: 0,
                credentials: {
                    firstname: firstname,
                    lastname: lastname,
                    birthDate: faker.date.past(),
                    address: faker.address.streetAddress(),
                    email: email,
                    phone: faker.phone.phoneNumber(),
                    password: hash,
                },

                communities: [
                    communityId
                ],
                profile: {
                    profileCummunityId: communityId,
                    profilePhoto: "uploads/" + profileAvatar + ".png",
                    profileFirstname: firstname,
                    profileLastname: lastname,
                    profileIsAdmin: 0,
                    profileUserIsActive: true,
                    profileUserIsDeleted: false,
                },
                filterEvent: {
                    SportValue: false,
                    ArtsValue: false,
                    cultureValue: false,
                    MediaValue: false,
                    musicValue: false,
                    socialValue: false,
                    internValue: false,
                    businessValue: false,
                    communityValue: false,
                    santeValue: false,
                    itValue: false,
                    lifestyleValue: false,
                    partyValue: false,
                    meetingValue: false,
                    WorkshopValue: false,
                },
                passions: [],
                skills: [],
                currentEvents: [],
                "currentEvents.eventsICreated": [],
                "currentEvents.eventsIParticipate": [],
                parameters: [],
                passedEvents: [],
                "passedEvents.PassedevenementsICreated": [],
                "passedEvents.PassedEvenementsParticipated": [],

            })
        })
    })
}

async function generateUsers() {

  let users = {}

  for (let id=1; id <= 50; id++) {
    user = new User(await creatNewAccountUser());
    user.save();
    user = {};
  }
  console.log("50 user added to database!")
}

module.exports = {
    generateUsers,
    creatNewAccountUser
}
