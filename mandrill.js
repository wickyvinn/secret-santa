///////////////////////////////////////////////////
//////////////// Mandrill Settings ////////////////
///////////////////////////////////////////////////

var apiKey    = 'Z-72jAyAFPIYUJnbEfzISQ'
var fromEmail = 'leslothlistens@gmail.com'
var options   = {
  host: 'www.mandrillapp.com',  
  port: 80,
  path: '/api/1.0/messages/send.json',
  method: 'POST'
};
var emailBodyFile = 'email.html'

///////////////////////////////////////////////////

var mandrill        = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill(apiKey);
var fs              = require('fs');

var mandrill = function (santaToChild, contactBook) {
  this.santaToChild = santaToChild
  this.contactBook  = contactBook
  this.result = 'No errors, successfully sent emails.'
};

fs.readFile(emailBodyFile, 'utf8', function (err,data) {
  if (err) throw new Error('Unable to read email body file.')
  emailBody = data
});


mandrill.prototype.sendEmails = function () {

  for (santa in this.santaToChild) {

    var childName = this.santaToChild[santa]
    var santasEmail = this.contactBook[santa]
    // there should be a better way to do this, i.e. feed arguments into html file? 
    var finalEmailBody = emailBody.replace('{childName}', childName);
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
      "subject": "SECRET SANTA! You're giving a gift to: " + childName + "!",
      "html": finalEmailBody
    };

    mandrill_client.messages.send({"message": message}, function(result) {
      this.result = result;
    }, function(e) {
      this.result = e.name
    });

    return this.result  
  };
  
};

module.exports = mandrill; 
