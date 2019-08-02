var path = require('path');

exports.sendEmailAccountCreation = (to, subject, email, psw, name) => {
    var nodemailer = require('nodemailer');
    var EmailTemplate = require('email-templates').EmailTemplate;

    var transporter;

    // if (process.env.NODE_ENV == "dev") {
    //     console.log("dev")
    //     transporter = nodemailer.createTransport({
    //         pool: false,
    //         host: 'smtp.localhost',
    //         port: 1025,
    //         auth: {
    //             user: null,
    //             pass: null
    //         },            
    //         secure:false,
    //         tls: {rejectUnauthorized: false},
    //         debug:true
    //     })
    // } else {
    transporter = nodemailer.createTransport({
        host: 'send.one.com', //host of mail service provider
        port: 465,
        secure: true,
        auth: {
            user: process.env.USER,
            pass: process.env.PASS
        }
    });
    //}


    var templateDir = path.join(__dirname, "../../", 'emailsTemplate', 'templates/accountCreation/')

    var testMailTemplate = new EmailTemplate(templateDir)

    var locals = {
        email: email,
        password: psw,
        name: name
    }

    testMailTemplate.render(locals, function (err, temp) {
        if (err) {
            console.log("error", err);
        } else {
            transporter.sendMail({
                from: process.env.USER,
                to: to,
                subject: subject,
                text: temp.text,
                html: temp.html
            }, function (error, info) {
                if (error) {
                    console.log("sendEmailAccountCreation : Email failed to be sent");
                } else
                    console.log('Message sent: ' + info.response);
            })
        }
    })
}