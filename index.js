var express       = require('express')
var bodyParser    = require('body-parser')
var SantaSelector = require('./select-santa.js');
var Mandrill      = require('./mandrill.js');

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set('port', (process.env.PORT || 5000)); 
app.use(express.static(__dirname + '/public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('index.html');
});

app.post('/submit', function(request, response) {
  var emailSubject = request.body.email_subject;
  var emailBody = request.body.email_body;
  var namesEmailArray = request.body.peeps; // ["name1:email1", "name2:email2"]
  var contactBook = {}; // {"name1":"email1", "name2":"email2"}
  var namesOnly = []; // ["name1", "name2"]
  for (person in namesEmailArray) {
    var parts = namesEmailArray[person].split(":");
    var name  = parts[0];
    var email = parts[1];
    namesOnly.push(name);
    contactBook[name] = email;
  }

  var ss = new SantaSelector(namesOnly);
  var santaToChild = ss.validDraw();
  var md = new Mandrill(santaToChild, contactBook, emailSubject, emailBody);  
  var mandrillResponse = md.sendEmails();

  response.render('user', { data: santaToChild }, function(err, html) {
  });

});

app.listen(app.get('port'), function() {
  console.log('Secret santa app is running at localhost:' + app.get('post'));
});

