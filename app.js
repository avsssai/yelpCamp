var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  PORT = 3450,
  mongoose = require('mongoose'),
  passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  session = require('express-session'),
  bcrypt = require('bcryptjs'), 
  User = require('./models/user'),
  methodOverride = require('method-override'),
  flash = require("connect-flash");


var seed = require('./seeds');

app.use(express.static(__dirname+'/public'));

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.use(methodOverride("_method"));

var campgroundsRoutes = require('./routes/campgroundsRoutes'),
    commentsRoutes    = require('./routes/commentsRoutes'),
    authRoutes        = require('./routes/authRoutes'); 

mongoose.connect("mongodb://localhost:27017/yelpCamp",{useNewUrlParser:true,useUnifiedTopology:true,useFindAndModify:false},(err)=>{
    if(err){
        console.error(err);
    }else{
        console.log("Connected Successfully.");
    }
});

app.use(flash());

app.use(session({
    secret:"shiva",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());

//middleware to render user current user in the header of all views.
app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/campgrounds",campgroundsRoutes);
app.use("/campgrounds/:id/comments",commentsRoutes);
app.use("/",authRoutes);

passport.use(new LocalStrategy(
    function(username,password,done){
        //find the user and compare the passwords.
        User.findOne({username:username},(err,user)=>{
            if(err){
                return done(err);
            }
            if(!user){
                return done(null,false);
            }
            //compare passwords
            bcrypt.compare(password,user.password,(err,passwordsMatch)=>{
                if(err){
                    return done(null,false);
                }if(passwordsMatch){
                    return done(null,user);
                }else{
                    return done(null,false,{message:'Invalid password!'});
                }
            })
            // User.comparePassword(password,user.password,(err,isMatch)=>{
            //     if(err){
            //         return done(null,false);
            //     }
            //     if(isMatch){
            //         return done(null,user);
            //     }
            //     else{
            //         return done(null,false,{message:"Invalid Password."});
            //     }
            // })
        })
    }
))

//USE THIS AS REF (COPIED CODE)
// passport.use(new LocalStrategy(
//     function(username, password, done) {
//       User.getUserByUsername(username, function(err, user){
//            if(err) throw err;
//            if(!user){
//                 return done(null, false, {message: 'Unknown User'});
//            }
  
//            User.comparePassword(password, user.password, function(err, isMatch){
//                if(err) throw err;
//                if(isMatch){
//                    return done(null, user);
//                } else {
//                    return done(null, false, {message: 'Invalid password'});
//                }
//            });
//      });
//     }
//   ));


passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

// seed();

app.get("*", (req, res) => {
  res.send("<h2>404 Page Assam...</h2>");
});
app.listen(PORT, () => {
  console.log("Server for YelpCamp has started! on " + PORT);
});
