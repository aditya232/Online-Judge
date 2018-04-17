#!/usr/bin/env node
var amqp = require('amqplib/callback_api');
var fs = require('fs');
var path = require('path');
var axios = require('axios');
const exec = require('sync-exec');
const asyncExec = require('child_process').exec;
const {checker,directorySetup} = require('./docker.js');

amqp.connect('amqp://localhost', function(err, conn) {
  conn.createChannel(function(err, ch) {
    var q = 'hello';
    ch.assertQueue(q, {durable: false});
    ch.prefetch(1);
    ch.consume(q, function(msg) {
	    var message = (JSON.parse(msg.content.toString()));
	    console.log(message);
	    try{
		    //The directory to be mounted to the container which will contain the test case folder and the file with code.
		    dirPath = directorySetup(message['compiler'],message['problemId'],message['code'],message['customInput']) ;
		    console.log("dirpath: " + dirPath);
		    //Execute the command to create the container with directory mounted to it.
			container = (exec(`docker run -it -d  -v ${dirPath}:/usr/src/app sandbox`));
			console.log("container: " + JSON.stringify(container, null, "  "));
		}catch(err){
			throw err;
		}
		var submission = {'container':container,
		'compiler':message['compiler'],
		'tl':message['tl'],
		'code':message['code'],
		'problemId':message['problemId'],
		'customInput':message['customInput']
		}
		if(message['customInput']){
			submission.testId ='0' ;
			var x=(checker(submission));
			console.log(x);
		axios.post('http://localhost:8080/problem/notify',{'clientId':message['clientId'],'output':x.output}).catch(function(err){ console.log(err)});
		}
		else{
			var source = path.join(__dirname,`testcases/input/${message['problemId']}`)
			console.log(source);
			fs.readdirSync(source,'utf8').forEach(function(input){
				submission.testId = input;
				console.log(checker(submission));
			});	
		axios.post('http://localhost:8080/problem/notify',{'clientId':message['clientId'],'result':'task complete'}).catch(function(err){ console.log(err)});
		}
		//Remove the container and the directory mounted to the container asynchronously
		asyncExec(`docker rm -f ${container.stdout.substring(0,3)} ; rm -rf ${dirPath}`, (err, stdout, stderr) => {callback(err,stdout,stderr)}); 
		
	    }, {noAck: true});
  });
});
