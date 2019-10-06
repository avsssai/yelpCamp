var Campground = require("../models/campgrounds");
var Comment = require('../models/comments');
var middlewareObj = {};


middlewareObj.isLoggedIn = function(req,res,next){
    if(req.user){
        next();
    }else{
        req.flash("error","You must be logged in to do that!");
        res.redirect('/login');
    }

}

middlewareObj.checkCommentOwnership = function(req,res,next){
        //is the user authenticated?
        if(req.isAuthenticated()){
            //does the user own the comment?
            Comment.findById(req.params.comment_id,(err,foundComment)=>{
                if(err){
                    res.redirect('back');
                    req.flash("error","Something went wrong.");
                }else{
                    //the ids of the comment owner and the foundComment author must match
                    if(foundComment.author.id.equals(req.user._id)){
                        next();
                    }else{
                        req.flash("You don't have permissions to do that.");
                        res.redirect("back");
                    }
                }
            })
        }else{
            req.flash("error","You must be logged in to do that!");

            res.redirect("back");
        }    
}

middlewareObj.checkCampgroundOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id,(error,foundCamp)=>{
            if(error){
                req.flash("error","Something went wrong.");
                console.log(error);
            }else{
                //The owner of the camp should only be able to edit the camp.
                if(foundCamp.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("You don't have permissions to do that.");
                    res.redirect("back");

                }
    
            }
        })
    
    }else{
        req.flash("error","You must be logged in to do that!");

        res.redirect("back");
    }
}

module.exports = middlewareObj;