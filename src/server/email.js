var nodemailer = require('nodemailer');
var smtpTransporter = require('nodemailer-smtp-transport');
var handlebars = require('handlebars');
var fs = require('fs');
var Commons = require('./commons');

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

var smtpTransport = nodemailer.createTransport(smtpTransporter({
    service: 'raksan',
    host: '10.0.2.26',  //'smtp.raksan.in',
    secure: false,
    // ssl : false,
    port: 25,
    // auth: {
    //     user: 'icocoin@moolyacoin.io',
    //     pass: 'raksan123'
    // },
     tls: {
        rejectUnauthorized: false
        }
}));
 
const  sendRegistrationEmail = async function (req){
    //console.log("Req",req);
    readHTMLFile(__dirname + '/email_templates/registrationRequestReceived.html', async function(err, html) {
        var template = handlebars.compile(html);
        var replacements = {
            FirstName : req.firstName,
            //UniqueId : req.UniqueId
        };
        var htmlToSend = template(replacements);
        var attachmentsFileDetails = await Commons.getDocFile("MLC_STC");

        var fileInfo = fs.readFileSync(attachmentsFileDetails.filePath+""+attachmentsFileDetails.fileName);
        //console.log("File Info:",fileInfo);

        // console.log("HTMLSENDTO",htmlToSend)
        var mailOptions = {
            from: 'no-reply@moolyacoin.io',
            to : req.to,
            subject : ' Registration successful',   //: Unique-ID: ' + req.UniqueId
            html : htmlToSend,
            attachments: [
                {
                    //path: 'https://s3.raksan.in/moolyacoin/moolyacoin_sale_terms_and_conditions_ver1.2.pdf'
                    filename : attachmentsFileDetails.fileName,
                    content : fileInfo
                },
            ]
         };
         smtpTransport.sendMail(mailOptions, function (error, response) {
            if (error) {
                console.log(error);
                // callback(error);
            }
            else{
                //console.log("Registration Email response is:",response);
            }
        });
    });
}
const  sendWhiteListEmail = async function (reqObj){
    //console.log("Req",reqObj);
    readHTMLFile(__dirname + '/email_templates/whiteList.html', async function(err, html) {
        var template = handlebars.compile(html);
        var replacements = {
            FirstName : reqObj.firstName,
            //UniqueId:  reqObj.uniqueId
        };

        var htmlToSend = template(replacements);
        // console.log("HTMLSENDTO",htmlToSend)
        var attachmentsFileDetails = await Commons.getDocFile("MLC_STC");

        var fileInfo = fs.readFileSync(attachmentsFileDetails.filePath+""+attachmentsFileDetails.fileName);

        var mailOptions = {
            from: 'backers@moolyacoin.io',
            to : reqObj.to,
            subject : 'moolyacoin : Successfully whitelisted ', //: Congratulations : ID: '+ reqObj.uniqueId
            html : htmlToSend,
            attachments: [
                {
                    //path: 'https://s3.raksan.in/moolyacoin/moolyacoin_sale_terms_and_conditions_ver1.2.pdf',
                    filename : attachmentsFileDetails.fileName,
                    content : fileInfo
                },
            ]
         };
         smtpTransport.sendMail(mailOptions, function (error, response) {
            if (error) {
                console.log(error);
                // callback(error);
            }
            else{
                //console.log("White List Email response is:",response);
            }
        });
    });
}
const  sendBlackListEmail = function (reqObj){
    //console.log("Req",reqObj);
    readHTMLFile(__dirname + '/email_templates/blackList.html', function(err, html) {
        var template = handlebars.compile(html);
        var replacements = {
            FirstName : reqObj.firstName,
            //UniqueId : reqObj.uniqueId
        };
        var htmlToSend = template(replacements);
        // console.log("HTMLSENDTO",htmlToSend)
        var mailOptions = {
            from: 'backers@moolyacoin.io',
            to : reqObj.to,
            subject : 'moolyacoin : Could not be whitelisted ' ,    //: Sorry : ID: ' + reqObj.uniqueId
            html : htmlToSend
         };
         smtpTransport.sendMail(mailOptions, function (error, response) {
            if (error) {
                console.log(error);
                // callback(error);
            }
            else{
                //console.log("Black List Email response is:",response);
            }
        });
    });
}
const  sendHoldEmail = function (reqObj){
    //console.log("Req",reqObj);
    readHTMLFile(__dirname + '/email_templates/hold.html', function(err, html) {
        var template = handlebars.compile(html);
        var replacements = {
            FirstName : reqObj.firstName,
            //UniqueId : reqObj.uniqueId
        };
        var htmlToSend = template(replacements);
        // console.log("HTMLSENDTO",htmlToSend)
        var mailOptions = {
            from: 'backers@moolyacoin.io',
            to : reqObj.to,
            subject : 'moolyacoin : Backer profile is on HOLD ',      //ID: ' + reqObj.uniqueId
            html : htmlToSend
         };
         smtpTransport.sendMail(mailOptions, function (error, response) {
            if (error) {
                console.log(error);
                // callback(error);
            }
            else{
                //console.log("Hold Email response is:",response);
            }
        });
    });
}
const  sendMoreInfoEmail = function (reqObj){
    //console.log("Req",reqObj);
    readHTMLFile(__dirname + '/email_templates/moreInfo.html', function(err, html) {
        var template = handlebars.compile(html);

        var replacements = {
            FirstName : reqObj.firstName,
            //UniqueId : reqObj.uniqueId,
            comments_line_1  :'',
            comments_line_2 : '',
            comments_line_3:'',
            comments_line_4:'',
            comments_line_5:''
            //comments : reqObj.moreDetails // Unable to parse HTML code directly, that's why here 'comments' are divided by no.of lines.
        };

        if(reqObj.moreDetails && reqObj.moreDetails){
            var commentsMsg =  reqObj.moreDetails.replace("<span>","");
            commentsMsg =  commentsMsg.replace("</span>","");
            var commentsList = commentsMsg.split("<br>");
            //console.log("Comments list:",commentsList);
            if(commentsList && commentsList.length>0){
                if(commentsList[0]){
                    replacements.comments_line_1 = commentsList[0];
                }
                if(commentsList[1]){
                    replacements.comments_line_2 = commentsList[1];
                }
                if(commentsList[2]){
                    replacements.comments_line_3 = commentsList[2];
                }
                if(commentsList[3]){
                    replacements.comments_line_4 = commentsList[3];
                }
                if(commentsList[4]){
                    replacements.comments_line_5 = commentsList[4];
                }
            }
        }
        //console.log("In Replc:",replacements);
        var htmlToSend = template(replacements);
        // console.log("HTMLSENDTO",htmlToSend)
        var mailOptions = {
            from: 'backers@moolyacoin.io',
            to : reqObj.to,
            subject : 'moolyacoin : Requesting more information ',      //: ID: ' + reqObj.uniqueId
            html : htmlToSend
         };
         smtpTransport.sendMail(mailOptions, function (error, response) {
            if (error) {
                console.log(error);
                // callback(error);
            }
            else{
                //console.log("Additional Info Email response is:",response);
            }
        });
    });
}
const  sendTransferThankYouEmail = function (reqObj){
    //console.log("Req",reqObj);
    readHTMLFile(__dirname + '/email_templates/ethTransfer.html', function(err, html) {
        var template = handlebars.compile(html);
        var replacements = {
            FirstName : reqObj.firstName,
            //UniqueId : reqObj.UniqueId
        };
        var htmlToSend = template(replacements);
        // console.log("HTMLSENDTO",htmlToSend)
        var mailOptions = {
            from: 'no-reply@moolyacoin.io',
            to : reqObj.to,
            subject : 'moolyacoin :We received your ETH transferred request ',   //+ reqObj.UniqueId,
            html : htmlToSend
        };
        smtpTransport.sendMail(mailOptions, function (error, response) {
            if (error) {
                console.log(error);
                // callback(error);
            }
            else{
                //console.log("Transfer Thankyou Email response is:",response);
            }
        });
    });
}
const  sendDailyReportEmail = function (reqObj){
    var template = reqObj;  // handlebars.compile(reqObj);
    var mailOptions = {
        from: 'backers@moolyacoin.io',
        to : 'backers@moolyacoin.io',
        subject : 'New Registrations List',
        html : template
    };
    smtpTransport.sendMail(mailOptions, function (error, response) {
        if (error) {
            console.log(error);
            // callback(error);
        }
        else{
            console.log("Daily Report Email response is:",response);
        }
    });
};


const sendRegistrationDetails = async function(emailDetails){
    var template = '<div>';
    template+="<div>Name: "+ emailDetails.Name+"</div><br>";
    template+="<div>EMail: "+emailDetails.emailId+"</div><br>";
    template+="<div>Country: "+ emailDetails.countryName+"</div><br>";
    template+="<div>Phone Number: "+ emailDetails.contactNumber+"</div>";

    template +="</div>";
    var mailOptions = {
        from: 'no-reply@moolyacoin.io',
        to :  'backers@moolyacoin.io',
        subject : 'New Registration - '+emailDetails.countryName,
        html : template
    };
    smtpTransport.sendMail(mailOptions, function (error, response) {
        if (error) {
            console.log(error);
            // callback(error);
        }
        else{
            //console.log("New Reg Email response is:",response);
        }
    });
};

const sendSecondaryRegistrationEmail = async function (req){
    readHTMLFile(__dirname + '/email_templates/secondaryRegistrationReceived.html', async function(err, html) {
        var template = handlebars.compile(html);
        var replacements = {
            FirstName : req.firstName,
        };
        var htmlToSend = template(replacements);

        var mailOptions = {
            from: 'no-reply@moolyacoin.io',
            to : req.to,
            subject : ' moolyacoin: Congratulations! You can now participate in our ICO',
            html : htmlToSend
        };
        smtpTransport.sendMail(mailOptions, function (error, response) {
            if (error) {
                console.log(error);
            }
            else{
                    //console.log("Secondary Registration Email response is:",response);
            }
        });
    });
};


const sendEmailCustomTemplate1 = function(req){
    readHTMLFile(__dirname + '/email_templates/emailCustomTemplate1.html', async function(err, html) {

        var htmlCode = html.split("{{emailBodyContent}}");
        var htmlToSend = htmlCode[0];

        htmlToSend+=req.emailContent;

        htmlToSend+= htmlCode[1];

        //console.log("Sending Email To:",req.emailTo);

        var mailOptions = {
            from: 'no-reply@moolyacoin.io',
            to : req.emailTo,
            subject : req.emailSubject,
            html : htmlToSend
        };
        smtpTransport.sendMail(mailOptions, function (error, response) {
            if (error) {
                console.log(error);
            }
            else{
                //console.log("Custom Temp-1 Email response is:",response);
            }
        });
    });

};

module.exports= {sendRegistrationEmail,sendWhiteListEmail,sendBlackListEmail,sendHoldEmail,sendMoreInfoEmail,sendTransferThankYouEmail,sendDailyReportEmail,sendRegistrationDetails,
    sendSecondaryRegistrationEmail,sendEmailCustomTemplate1};