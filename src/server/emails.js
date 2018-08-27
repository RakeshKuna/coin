const nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
const path = require('path');
var fs = require('fs');


var appDir = path.join(__dirname , '/email_templates/receivedRequest.html');
 console.log("appDir", appDir)


const transporter = nodemailer.createTransport(smtpTransport({ // Use an app specific password here
    service: 'gmail',
    host: 'smtp.gmail.com',
    secure: false,
    ssl : false,
    port: 25,
    auth: {
        user: 'gajjalakreddy@gmail.com',
        pass: ''
    }
}));

const options = {
    from: "backers@moolyacoin.io",
    to: "sravani.sistla@raksan.in",
    subject: 'Registeration Successful',
    text: 'Moolya Coin!!!!!',
    attachments: [
        {
            path: appDir,//'../report.html',
            filename: 'receivedRequest.html',
            //  contents: data
        },
    ]
}

let emailReport = () => {
    return new Promise((resolve, reject) => {
        transporter.sendMail(options, (error, info) => {
            if (error) {
                //console.log("error in sendemail is",error)
                reject(error)
            } else {
                //console.log("info in sendemail is",info)
                resolve(info)
            }
        });
    });
}

// emailReport();

module.exports = {
    emailReport
}
