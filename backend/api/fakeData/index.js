const mockUser = require("./user/userData");
const mockEvent = require("./events/event");

const User = require("../models/user");
const Event = require("../models/event");

generateUserData = () => {
    User.find().then(usrs => {
        if (usrs.length == 0) {
            mockUser.generateUsers();
        } else 
            console.log("Database has users!")
    }).catch(err => console.log("Err :", err))    
}

generateEventData = () => {
    Event.find()
    .exec()
    .then(events => {
        if (events.length == 0) {
            mockEvent.generateEvents();
        } else {
            console.log("Database has events!")
        }
    }).catch(err => console.log("Err :", err));
}

module.exports = {
    generateUserData,
    generateEventData
}
