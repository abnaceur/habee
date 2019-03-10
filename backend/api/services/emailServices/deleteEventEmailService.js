var path = require('path');

exports.delEventEmail = (to, subject, name, eventDate, eventTitle) => {
    var nodemailer = require('nodemailer');
    var EmailTemplate = require('email-templates').EmailTemplate;

    var transporter = nodemailer.createTransport({
        host: 'send.one.com', //host of mail service provider
        port: 465,
        secure: true,
        auth: {
            user: process.env.USER,
            pass: process.env.PASS
        }
    });

    var templateDir = path.join(__dirname, "../../", 'emailsTemplate', 'templates/deleteEvent/')

    var testMailTemplate = new EmailTemplate(templateDir)

    var locals = 
        {
            name: name,
            eventName: eventTitle,
            eventStartDate: eventDate 
        }

    testMailTemplate.render(locals, function (err, temp) { 
        console.log("temp : ", temp)
    })

    testMailTemplate.render(locals, function (err, temp) {
        if (err) {
            console.log("error", err);

        } else {
            console.log("temp : ", temp)
            transporter.sendMail({
                from: process.env.USER,
                to: to,
                subject: subject,
                text: temp.text,
                html: temp.html
            }, function (error, info) {
                if (error) {

                    console.log(error);
                }
                console.log('Message sent: ' + info.response);
            })
        }
    })
}