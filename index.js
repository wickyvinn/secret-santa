var express       = require('express')
var bodyParser    = require('body-parser')
var SantaSelector = require('./select-santa.js');
var http = require('http');
var app = express();
var querystring = require('querystring');

var mandrill = require('mandrill-api/mandrill'); 
var mandrill_client = new mandrill.Mandrill('Z-72jAyAFPIYUJnbEfzISQ');


// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Set port, heroku style
// Run locally: foreman start web
app.set('port', (process.env.PORT || 5000)); 

// express.static middleware
app.use(express.static(__dirname + '/public'));

// ejs will provide a renderFile method w this signature: (path, options, callback)
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('index.html');
});

app.post('/submit', function(request, response) {
  var people = request.body.peeps.split(",");
  var peopleObj = {};
  var names = [];
  for(p in people) {
    var parts = people[p].split(":");
    var name  = parts[0];
    var email = parts[1];
    names.push(name);
    peopleObj[name] = email;
  }

  var ss = new SantaSelector(names);
  var santaToChild = ss.validDraw();

  var options = {
    host: 'www.mandrillapp.com',
    port: 80,
    path: '/api/1.0/messages/send.json',
    method: 'POST'
  };

  var rrrresponse = "No errors, successfully sent emails."

  for (santa in santaToChild) {
    var childName = santaToChild[santa]
    var santasEmail = peopleObj[santa]

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
        console.log(result);
    }, function(e) {
        console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
        rrrresponse = e.name
    });

  };

  response.send(rrrresponse)
  
});

app.listen(app.get('port'), function() {
  console.log('Secret santa app is running at localhost:' + app.get('post'));
});

