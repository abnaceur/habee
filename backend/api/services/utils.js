

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

    console.log("New 111: ", newObj);
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

exports.sendEmail= (from, to, subject, txt) => {
    var nodemailer = require('nodemailer');

    console.log("tarck 1");
    var transporter = nodemailer.createTransport({
        service: process.env.SERVICE,
        host: process.env.HOST,
        auth: {
            user: process.env.USER,
            pass: process.env.PASS
        }
    });
    console.log("tarck 2");
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