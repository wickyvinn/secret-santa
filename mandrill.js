var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill('Z-72jAyAFPIYUJnbEfzISQ');

// input: an object {"santaName":"childName"}
// output: a html response 
var mandrill = function (santaToChild, contactBook) {
  // santaToChild: {santaName: childName}
  this.santaToChild = santaToChild
  this.contactBook  = contactBook
  this.result = "No errors, successfully sent emails."
}

var options = {
  host: 'www.mandrillapp.com',  
  port: 80,
  path: '/api/1.0/messages/send.json',
  method: 'POST'
};

mandrill.prototype.sendEmails = function () {
  for (santa in this.santaToChild) {
    var childName = this.santaToChild[santa]
    var santasEmail = this.contactBook[santa]

    var message = {
      "from_email": "leslothlistens@gmail.com",
      "to": [
        {
          "email": santasEmail,
          "name" : santa,
          "type": "to"
        },
      ],
      "autotext": "true",
      "subject": "SECRET SANTA! You're giving a gift to: " + childName + "!",
      "html": "<img src='http://s3-ec.buzzfed.com/static/2013-12/enhanced/webdr07/10/16/enhanced-buzz-5875-1386710638-21.jpg' height='300'> <p>For Secret Santa, you've been assigned to give a gift to: " + childName + "! OMG. </p><p>Now remember, you can't spend any money, although you can use gift certificiates or coerce others to buy things for you. Gifts are due <strong> Tuesday night, 1130pm. </strong> </p> <p> This message was made possible by <a href='https://github.com/wickyvinn/secret-santa'>A Secret Santa App!</a> </p>"
    };

    mandrill_client.messages.send({"message": message}, function(result) {
      this.result = result;
    }, function(e) {
      console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
      this.result = e.name
      return this.result      
    });

  };
  console.log("result: " + this.result)
};

module.exports = mandrill; 
