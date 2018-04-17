var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var amqp = require('amqplib/callback_api');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
server.listen(8080)
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); // true
app.use(cookieParser());
app.use('/public',express.static('public'));

app.use(session({
              secret: 'Amogh Babbar',
              resave: false,
              saveUninitialized: true,
              cookie: { maxAge: 60000 }
            }))

var db = require('./db');
global.__root   = __dirname + '/'; 

/*app.get('/', function (req, res) {
  // res.status(200).send('API works. Goto users route');
  res.redirect("/users");
});*/

var UserController = require(__root + 'user/UserController');
app.get('/test',function(req,res){
	res.sendFile(path.join(__root,'public/index.html'));
})
app.use('/', UserController);

var ProblemController = require(__root + 'user/problem')(io);
app.use('/problem', ProblemController);

var AuthController = require(__root + 'auth/AuthController');
app.use('/auth', AuthController);

//var Checker = require(__root + "checker_app/app")
//app.use('/judge', Checker);

io.on('connection', function (socket) {
  socket.emit('register',socket.id);
});

module.exports = app;
