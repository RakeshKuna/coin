var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var handlebars = require('handlebars');
var fs = require('fs');

var readHTMLFile = function(path, callback) {
    fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
        if (err) {
            throw err;
            callback(err);
        }
        else {
            callback(null, html);
        }
    });
};

var smtpTransport = nodemailer.createTransport(smtpTransport({
    service: 'raksan',
    host:'smtp.raksan.in',
    port: 25,
    auth: {
        user: 'icocoin@moolyacoin.io',
        pass: 'raksan123'
    },
	secure:false,
	tls:{rejectUnauthorized:false},
	debug:true 
}));
 
const  sendRegistrationEmail = function (req){
    console.log("Req",req);
    readHTMLFile(__dirname + '/email_templates/receivedRequest.html', function(err, html) {
        var template = handlebars.compile(html);
        var replacements = {
            FirstName : "sravani",
            "Unique-ID" : req.emailId
        };
        var htmlToSend = template(replacements);
        // console.log("HTMLSENDTO",htmlToSend)
        var mailOptions = {
            from: 'backers@moolyacoin.io',
            to : req.to,
            subject : 'Welcome to Moolya Coin!!!!',
            html : htmlToSend
         };
         smtpTransport.sendMail(mailOptions, function (error, response) {
            if (error) {
                console.log(error);
                // callback(error);
            }
            else{
                console.log("Email response is:",response);
            }
        });
    });
}
module.exports= {sendRegistrationEmail};

   
