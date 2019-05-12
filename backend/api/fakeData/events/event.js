const faker = require('faker');
const Event = require("../../models/event");
const User = require("../../models/user");
let mongoose = require('mongoose');

async function eventClass(comId, userId) {
    return new Promise((resolve, reject) => {
        resolve({
            _id: new mongoose.Types.ObjectId,
            eventId: new mongoose.Types.ObjectId,
            eventCommunity: [comId],
            eventName: faker.lorem.word(),
            eventPhoto: faker.image.imageUrl(200, 260),
            eventCreator: userId,
            eventDescription: faker.lorem.paragraph(20),
            eventStartDate: faker.date.soon,
            eventEndDate: faker.date.future(),
            eventStartHour: "12:12",
            eventEndHour: "12:12",
            eventDuration: "2 days",
            eventLocation: faker.address.city(),
            nbrParticipants: faker.random.number(),
            participants: [],
            eventCategory: "Sports",
            eventIsPublic: false,
            eventIsDeleted: false,
        })
    })
}

async function getAlluserIds() {
    return new Promise((resolve, reject) => {
        User.find()
            .select("userId")
            .select("activeCommunity")
            .exec()
            .then(usrIds => {
                console.log("UserIds :", usrIds);
                resolve(usrIds)
            }).catch(err => console.log("Err :", err));
    })
}

async function generateEvents() {

    let event = {}
    let userInfo = await getAlluserIds();

    userInfo.map(async usr => {
        for (let id = 1; id <= 50; id++) {
            event = new Event(await eventClass(usr.userId, usr.activeCommunity));
            event.save();
            event = {};
        }
    })

    console.log("Events added to database!")
}

module.exports = {
    getAlluserIds,
    eventClass,
    generateEvents,
}