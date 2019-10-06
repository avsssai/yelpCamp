var express = require('express');
var router = express.Router({mergeParams:true});

var Campground = require('../models/campgrounds');
var Comment = require('../models/comments');

var middleware = require('../middleware/index');



//==========================COMMENTS ROUTES==========================//

// app.use("/campgrounds/:id/comments",commentsRoutes);


//NEW ROUTE
//FORM render
router.get('/new',middleware.isLoggedIn,(req,res)=>{
    var id = req.params.id;
    // Campground.findById(id,(err,foundCamp)=>{
    //     if(err){
    //         console.log(err);
    //     }else{
    //         res.render('comments/new',{camp:foundCamp});
    //     }
    // })
    Campground.findById(id,(err,camp)=>{
        if(err){
            console.log(err);
        }else{
            res.render('comments/new',{camp:camp});

        }
    })
})

//CREATE ROUTE
router.post('/',middleware.isLoggedIn,(req,res)=>{
    //post to the campground in which the comment has been made.
    //redirect back to the camp show page.
    var id = req.params.id;
    Campground.findById(id,(err,foundCamp)=>{
        if(err){
            console.log(err);
        }else{
            //we have access to the campground.
            //post comment and then redirect back to the show page.
            var comment = req.body.comment;
            Comment.create(comment,(err,createdComment)=>{
                if(err){
                    console.log(err);
                    res.redirect('/campgrounds');
                    console.log('comment failed.');
                }else{
                    //append the comment in the campground related.
                    //associate the username to the comment.
                    createdComment.author.id = req.user._id;
                    createdComment.author.username = req.user.username;                        
                    // //save the comment.
                    createdComment.save();

                    foundCamp.comments.push(createdComment);
                    // console.log(req.user.username);
                    //save the new data..
                    foundCamp.save();
                    // console.log({success:true,message:"comment added.",comment:createdComment});
                    //redirect back..
                    res.redirect(`/campgrounds/${id}`);
                    
                }
            })
        }
    })
})


//edit route
router.get('/:comment_id/edit',middleware.checkCommentOwnership,(req,res)=>{
    Campground.findById(req.params.id,(err,foundCamp)=>{
        if(err){
            console.log(err);
        }else{
                //find the comment.
            Comment.findById(req.params.comment_id,(err,foundComment)=>{
                if(err){
                    console.log(err);
                    res.redirect("back");
                }else{
                    res.render('comments/edit',{camp:foundCamp,comment:foundComment});
                }
            })
        }
    })

})

//comment edit
//POSTing to /campgrounds/:id/comments/:comment_id
router.put('/:comment_id',middleware.checkCommentOwnership,(req,res)=>{
    //get the updated comment.
    var update = req.body.updatedComment;
    console.log("the update is "+update);
    Comment.findByIdAndUpdate(req.params.comment_id,update,(err,update)=>{
        if(err){
            console.log(err);
        }else{
            console.log("comment updated!");
            res.redirect("/campgrounds/"+ req.params.id);
        }
    })
})

//comment destroy
//POSTing to /campgrounds/:id/comments/:comment_id
router.delete('/:comment_id',middleware.checkCommentOwnership,(req,res)=>{
    Comment.findByIdAndRemove(req.params.comment_id,(err,comment)=>{
        if(err){
            console.log(err);
            res.redirect('/campgrounds/'+req.params.id)
        }else{
            res.redirect('/campgrounds/'+req.params.id)
        }
    })
})




module.exports = router;