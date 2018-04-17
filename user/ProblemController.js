var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var Usermodel = require("../models/user").user_model;
var Problemsmodel = require("../models/problems").problems_model;
// var Problemmodel = require("../models/problem").problem_model;

var VerifyToken = require(__root + 'auth/VerifyToken');

router.use(bodyParser.urlencoded({ extended: true }));


/*router.get("/", VerifyToken, function(req, res){
    Problemmodel.forge()
        .fetchAll()
        .then(function(result){
            if(result===null){
                console.log("No Problems in DB");
            }
            else{
                res.render("problems",{
                    problem: result
                })
            }
        })
});*/

router.post('/problemsubmit', function (req, res) {
    var title = req.body.title;
    var statement = req.body.statement;
    var time = req.body.time;
    var memory = req.body.memory;
    var resource = req.body.resource;
    var inputdescription = req.body.inputdescription;
    var outputdescription = req.body.outputdescription;
    var inputexample = req.body.inputexample;
    var outputexample = req.body.outputexample;
    var explaination = req.body.explaination;

    Problemsmodel.forge({
        title: title,
        statement: statement,
        time: time,
        memory: memory,
        resource: resource,
        inputdescription: inputdescription,
        outputdescription: outputdescription,
        inputexample: inputexample,
        outputexample: outputexample,
        explaination: explaination
    })
    .add()
    .then(function(res){
        console.log("Added");
    })
    .catch(function(err){
        console.log("failed");
    })
});

router.get("/submission/:id", function(req, res){
    var id = req.params.id
    Problemsmodel.forge({
        id:id
    })
    .fetch()
    .then(function(res){
        console.log(res);
    })
    .then(function(err){
        console.log("problem id does not exist");
    })
})

// router.post("/submission", VerifyToken, function(req, res){
router.post("/submission", function(req, res){
    name = req.body.name
    code = req.body.code
    statement = req.body.statement
    time_limit = req.body.time_limit
    source = req.body.source
    input1 = req.body.input1
    output1 = req.body.output1

    /*fs.writeFile('./code.cpp', code, function(err){
         // TODO: Aditya Call that api here 
    })

    fs.unlink('./code.cpp')*/
})
module.exports = router;
