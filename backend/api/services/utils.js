

exports.popObject = (obj, itemId) => {
    let i = 0;

    let newObj = [];
    while (i < obj.length) {
        if (obj[i] != null) {
            if (obj[i] != null && obj[i].eventId != itemId) {
                newObj.push(obj[i])
            }
        }
        i++;
    }

    return newObj;
}

exports.popEventObject = (obj, itemId) => {
    let i = 0;

    let newObj = [];
    while (i < obj.length) {
        if (obj[i] != null) {
            if (obj[i] != null && obj[i].participantId != itemId) {
                newObj.push(obj[i])
            }
        }
        i++;
    }
    return newObj;
}

exports.popEventObjectFromUser = (eventIsOver, eventParticiated) => {
    let i = 0;
    let j = 0;
    let check = 0;

    let newObj = [];
    while (i < eventParticiated.length) {
        while (j < eventIsOver.length) {
            if (eventParticiated[i].eventId === eventIsOver[j].eventId) 
                check = 1;
            j++;
        }
        j = 0;
        if (check === 0) {
            newObj.push(eventParticiated[i])
        } else
            check = 0;
        i++;
    }
    return newObj;
}

exports.sendEmail= (from, to, subject, txt) => {
    var nodemailer = require('nodemailer');

    var transporter = nodemailer.createTransport({
        service: process.env.SERVICE,
        host: process.env.HOST,
        auth: {
            user: process.env.USER,
            pass: process.env.PASS
        }
    });
    var mailOptions = {
        from: from,
        to: to,
        subject: subject,
        text: txt
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log("error : ", error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}