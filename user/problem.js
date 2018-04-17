var express = require('express') ;
var router = express.Router();
var path = require('path');
var amqp = require('amqplib/callback_api');
var bodyParser = require('body-parser');
var Problems_model = require('../models/problems').problems_model;

var urlencodedParser = bodyParser.urlencoded({ extended: true }) ;
var returnRouter = function(io) {
		router.get('/:id',function(req,res){
			var id = req.params.id;
			Problems_model.where({
				id:id
			})
			.fetch()
			.then(function(problem){
				var problem_json = problem.toJSON()
				var inputexample = problem_json.inputexample.toString().replace(/\r?\n/g, '<br />');  /*/^\n/i */
				var outputexample = problem_json.outputexample.toString().replace(/\r?\n/g, '<br />');
				var userid = req.session;
				console.log(JSON.stringify(userid, null, "  "));
				// var userid_json = userid.toJSON();
				// console.log(userid.userId);
				console.log("userid: " + userid.userId);
				// console.log(problem_json);
				res.render('indexxx',{'problem':problem_json, 
									  'problemId': problem_json.id, 
									  'inputexample': inputexample,
									  'outputexample': outputexample,
									  'userid': JSON.stringify(problem_json.id)
									}) ;
			})

		//res.sendFile(path.join(__dirname + '/../public/index.html'));
			
	})

	router.post('/evaluate',bodyParser.json(),function (req, res) {
		console.log(req.body);
		console.log(req.session.id);
		  amqp.connect('amqp://localhost', function(err, conn) {
			  conn.createChannel(function(err, ch) {
			    var q = 'hello';
			    var msg = JSON.stringify({'compiler':req.body.compiler,
			    	'tl':'1','problemId':req.body.problemId,
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

	router.post('/notify',bodyParser.json(),function(req,res){
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
    
    return router;
}
module.exports = returnRouter;