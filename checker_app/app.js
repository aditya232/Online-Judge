var express = require('express') ;
var app = express() ;
app.use('/public',express.static('public'));
var amqp = require('amqplib/callback_api');
var server = require('http').Server(app);
var bodyParser = require('body-parser');
var io = require('socket.io')(server);
var urlencodedParser = bodyParser.urlencoded({ extended: true }) ;

server.listen(8001);

app.get('/',function(req,res){
	res.sendFile(__dirname + '/index.html');
})

app.post('/evaluate',bodyParser.json(),function (req, res) {
	console.log(req.body);
	  amqp.connect('amqp://localhost', function(err, conn) {
		  conn.createChannel(function(err, ch) {
		    var q = 'hello';
		    var msg = JSON.stringify({
		    	'compiler':req.body.compiler,
		    	'tl':'1','problemId':'1',
		    	'clientId':req.body.clientId,'code':req.body.code,
		    	'customInput':req.body.customInput
		    });
		    ch.assertQueue(q, {durable: false});
		    ch.sendToQueue(q, new Buffer(msg));
		    console.log(" [x] Sent %s", msg);
		    res.end('running task...');
		  });
	  setTimeout(function() { conn.close();}, 500);
	});
});

app.post('/notify',bodyParser.json(),function(req,res){
	console.log(req.body.clientId);
	var client = io.sockets.connected[req.body.clientId];
	if(req.body.output){
		client.emit('custom',req.body.output);
	}
	else
    	client.emit('notify', req.body.result);
	res.type('text/plain');
    res.send('Result broadcast to client.');	
})


io.on('connection', function (socket) {
  socket.emit('register',socket.id);
});
