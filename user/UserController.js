var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var Usermodel = require("../models/user").user_model;

var VerifyToken = require(__root + 'auth/VerifyToken');

router.use(bodyParser.urlencoded({ extended: true }));


router.get("/index", function(req, res){
    res.render("index",{
        title: "COde Judge"
    })
})

router.get('/', function (req, res) {
  // res.status(200).send('API works. Goto users route');
  res.send('OK');
});

router.get('/login', function(req, res){
    var message1 = "";
    res.render("login",{
        title: "login",
        message: message1
    });
});

// CREATES A NEW USER
router.post('/login', function (req, res) {
    var email1 = req.body.email;
    var password1 = req.body.password;
    var sess = req.session;
        
    Usermodel.where({
        email: email1,
        password: password1
      })
        .fetch()
        .then(function (user){
            console.log("user");
            if(user===null){
                res.status(200).send({
                    success: false,
                    message: "Auth Failed"
                })
            }
            else {
                req.session.userId = user.id;
                req.session.user = user;
                // console.log(user);
                res.redirect('/home/dashboard');
            }
        })
});


router.get("/home/dashboard", VerifyToken, function(req, res, next){
   var user =  req.session.user,
   userId = req.session.userId;
   // console.log('ddd='+userId);
   /*if(userId == null){
      res.redirect("/login");
      return;
   }*/

   Usermodel.forge({
    id: userId
   })
   .fetch()
   .then(function(user){
        res.render('dashboard', {user:user})
   })
})


router.get('/register', function(req, res){
    message = '';
    res.render("register",{
        message: message
    });
});

router.post('/register', function(req, res){
    var username = req.body.user_name;
    var password = req.body.password;
    var email = req.body.email;

    Usermodel.forge({
        username: username,
        password: password,
        email: email
    }, {method: "insert"})
    .save()
    .then(function (response) {
        console.log("Added");
        res.redirect("/login")
      }).catch(function (reason) {
        console.log(reason);
      });
})

router.get("/home/logout",function(req, res){
      req.session.destroy(function(err) {
      res.redirect("/login");
   })
})


router.get("/problems", function(req, res){
    Problems.find({}, function (err, problem) {
        if (err) return res.status(500).send("There is a problem in fetching problems list.");
        res.status(200).render("problems", {
            title: problem
        });
    });
});

router.post('/problemsubmit', function (req, res) {
    Problems.create({
            problemName : req.body.problemName,
            problem : req.body.problem,
            output : req.body.password
        }, 
        function (err, user) {
            if (err) return res.status(500).send("There was a problem adding the information to the database.");
            res.status(200).send(user);
        });
});

router.get("/submission/:id", function(req, res){
    Problems.findById(req.params.id, function (err, user) {
        if (err) return res.status(500).send("There is an error on reaching the problem.");
        if (!user) return res.status(404).send("No problem exists.");
        res.status(200).send(user);
    });
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
