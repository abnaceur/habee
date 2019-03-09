var path = require('path');

exports.sendEmailAccountCreation = (to, subject, email, psw, name) => {
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

    var templateDir = path.join(__dirname, "../../", 'emailsTemplate', 'templates/accountCreation/')

    var testMailTemplate = new EmailTemplate(templateDir)

    var locals = 
        {
            email: email,
            password: psw,
            name: name   
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