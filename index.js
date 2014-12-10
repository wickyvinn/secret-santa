var express = require('express')
var bodyParser = require('body-parser')
var app = express()

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
  console.log(request.body);  
  response.send("submission successful");
});

app.listen(app.get('port'), function() {
  console.log('Secret santa app is running at localhost:' + app.get('post'));
});

