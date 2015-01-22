///////////////////////////////////////////////////
//////////////// Mandrill Settings ////////////////
///////////////////////////////////////////////////

var apiKey    = 'XXXXXXXXXXXXXXX'
var fromEmail = 'leslothlistens@gmail.com'
var options   = {
  host: 'www.mandrillapp.com',  
  port: 80,
  path: '/api/1.0/messages/send.json',
  method: 'POST'
};

///////////////////////////////////////////////////

var mandrill        = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill(apiKey);
var fs              = require('fs');

var mandrill = function (santaToChild, contactBook, emailSubject, emailBody) {
  this.santaToChild = santaToChild
  this.contactBook  = contactBook
  this.emailSubject = emailSubject
  this.emailBody    = emailBody
  this.result       = 'No errors, successfully sent emails.'
};

mandrill.prototype.sendEmails = function () {

  for (santa in this.santaToChild) {

    var childName = this.santaToChild[santa]
    var santasEmail = this.contactBook[santa]
    // there should be a better way to do this, i.e. feed arguments into html file? 
    var message = {
      "from_email": fromEmail,
      "to": [
        {
          "email": santasEmail,
          "name" : santa,
          "type": "to"
        },
      ],
      "autotext": "true",
      "subject": this.emailSubject,
      "html": "<html><body><p><strong>You're giving a gift to: " + childName + "!</strong></p>" + this.emailBody + "<p>This message was made possible by <a href='https://github.com/wickyvinn/secret-santa'>wickyvinn's secret santa app!</a> </p></body></html>"
    };

    mandrill_client.messages.send({"message": message}, function(result) {
      this.result = result;
      console.log("completed sending email to " + santasEmail)
    }, function(e) {
      // instead, throw a 400.
      this.result = e.name
      console.log("error result: " + this.result);
    });

  };

  return this.result  
};

module.exports = mandrill; 
