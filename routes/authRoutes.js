var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');

//====================================LOGIN ROUTES========================

// app.use("/",authRoutes);


router.get("/", (req, res) => {
    res.render("home");
});


router.get('/register',(req,res)=>{
    res.render('auth/register');
});

router.get('/login',(req,res)=>{
    res.render('auth/login');
});


router.post('/register',(req,res)=>{
    var newUser = new User({
        username:req.body.username,
        password:req.body.password
    });

    User.createUser(newUser,(err,userCreated)=>{
        if(err){
            req.flash("error",err);
            console.log(err);
        }else{
            req.flash("success","Registered Successfully, Please Login.");
            res.redirect('/login');
        }
    });
})

router.post('/login',passport.authenticate('local',{successRedirect:'/campgrounds',failureRedirect:'/login'}),(req,res)=>{
    // console.log(req.user);
})


router.get('/secret',(req,res)=>{
    res.render('auth/secret');
})

router.get('/logout',(req,res)=>{
    req.logout();
    req.flash("success","Logged you out successfully!");
    res.redirect('/campgrounds');
})





//====================================LOGIN ROUTES END========================

module.exports = router;