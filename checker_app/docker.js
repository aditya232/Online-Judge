const fs = require('fs');
const path = require('path');
const exec = require('sync-exec');
const {commands,statusCodes} = require('./commands.js');

copyDir = function(source,destination){
	fs.mkdirSync(destination);
	fs.readdirSync(source,'utf8').forEach(function(val){
		fs.copyFileSync(path.join(source,val),path.join(destination,val));
	});	
}

/*
         * @function
         * @name directorySetup
         * @description Function that creates a folder which will be mounted to a docker container in which  we will
           execute the user submitted code.First the code is written to a file and then the input and ouput files for the problem 
         * is copied into the folder.
         * 
         * @param {compiler} compiler for the selected language.
         * @param {code} Code submitted by user.
         * @param {Problem} Problem for which code was submitted
         * return {dirPath} Directory path that was created and will be mounted to the container.
*/
directorySetup = function (compiler,problemId,code,customInput){
	//Unique identifier for the folder to avoid collisions and allow parallel execution 
	var uid = Math.random().toString(36).substr(2, 5);
// 	var uid="test" ;
	var file =`main.${commands[compiler]['extension']}`;
	//var code = (fs.readFileSync(file, 'utf8'));
	var dirPath = path.join(__dirname,uid) ;
	fs.mkdirSync(dirPath);
	fs.writeFileSync(path.join(dirPath,file),code);
	if(customInput){
		 console.log('sadsadsadsadsadasdsfdsfdsf');
		fs.mkdirSync(path.join(dirPath,'input'));
		fs.writeFileSync(path.join(path.join(dirPath,'input'),'0'),customInput) ;
	}else{
		copyDir(path.join(__dirname,`testcases/input/${problemId}`),path.join(dirPath,'input')) ;
		copyDir(path.join(__dirname,`testcases/output/${problemId}`),path.join(dirPath,'output')) ;
	}
	return dirPath ;
}
/*
         * @function
         * @name final Command
         * @description Function that will return the final command that will be executed for the evaluation of the code.
         * 
         * @param {compiler} compiler for the selected language.
         * @param {containerCommand} container command appended with the docker container.
         * @param {tl} allowed time limit for execution
         * return {command} final command for execution
*/

finalCommand = function (compiler,containerCommand,tl,testId){
 	var commandCompile = commands[compiler]['compilation'] ;
 	var commandExec = commands[compiler]['run'] ;
	var command = "" ;
	if(commandCompile !="")
		command = `${containerCommand} ${commandCompile} ; ` ;
	command += `${containerCommand} cat input/${testId} | ${containerCommand} timeout ${tl} ${commandExec}` ;
	console.log("cpmmandL : " + command);
	return command ;
}

/*
         * @function
         * @name checker
         * @description Function that will judge the user submitted code.
*/
checker = function (submission){
	var container = submission.container;
	var compiler = submission.compiler;
	var tl = submission.tl
	var testId = submission.testId;
	var problemId = submission.problemId ;
	var judge = {};
 	judge['verdict'] = 'Not evaluated';
 	//command which is required for executing statements in a docker sandbox.Docker containers can be uniquely identified with
	//their first three characters of the container ID.
 	var containerCommand = `docker exec -i ${container.stdout.substring(0,3)}`;
 	var str = finalCommand(compiler,containerCommand,tl,testId) ;
 	console.log(str);
	res = exec(str) ;
	judge['status'] = statusCodes[res.status] ;
	//compiler error
	if(res.status ===1){
		judge['error_message'] = res.stderr ;
	}
	if(submission.customInput){
		judge['output']=res.stdout.trim();
		return judge;
	}
	//code executed in the given time limit without throwing any exception.Now check if the ouput matches with the required output.
	if(res.status === 0){
		res.stdout.trim() ;
		expected = fs.readFileSync(path.join(__dirname,`testcases/output/${problemId}/${testId}`),'utf8') ;
		expected.trim() ;
		judge['verdict'] = (res.stdout === expected ?'AC':'WA');
	}
	return judge ;
}

callback = function (err,stdout,stderr){
	if (err){
		throw err ;
	}
	return ;
}
module.exports = {'callback':callback,'checker':checker,'finalCommand':finalCommand,'directorySetup':directorySetup};

