var app = require('express')() ;
var amqp = require('amqplib/callback_api');
var server = require('http').Server(app);
var bodyParser = require('body-parser');
var io = require('socket.io')(server);
var urlencodedParser = bodyParser.urlencoded({ extended: true }) ;

server.listen(8000);

app.get('/',function(req,res){
	res.sendFile(__dirname + '/index.html');
})

app.post('/evaluate',urlencodedParser,function (req, res) {
	  amqp.connect('amqp://localhost', function(err, conn) {
		  conn.createChannel(function(err, ch) {
		    var q = 'hello';
		    var msg = JSON.stringify({'compiler':'python 2','tl':'1','id':'1','clientid':req.body.clientid});
		    ch.assertQueue(q, {durable: false});
		    ch.sendToQueue(q, new Buffer(msg));
		    //console.log(" [x] Sent %s", msg);
		    res.end('running task...');
		  });
	  setTimeout(function() { conn.close();}, 500);
	});
});

app.post('/notify',bodyParser.json(),function(req,res){
	console.log(req.body.clientid);
	var client = io.sockets.connected[req.body.clientid];
    client.emit('notify', req.body.result);
	res.type('text/plain');
    res.send('Result broadcast to client.');	
})


io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.emit('register',socket.id);
  socket.on('my other event', function (data) {
    console.log(socket.id);
  });
});