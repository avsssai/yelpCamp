var express = require('express');
var router = express.Router();
var Campground = require('../models/campgrounds');
var middleware = require('../middleware/index');

///==========CAMPGROUNDS ROUTES================///
  
// app.use("/campgrounds",campgroundsRoutes);


//INDEX ROUTE
router.get("/", (req, res) => {
    // console.log(req.user);
    Campground.find({},(error,allCampgrounds)=>{
        if(error){
            console.log({success:false,
            message:'Error sending camps.',
            error:error
        })
        }else{
            res.render('campgrounds/index',{campgrounds:allCampgrounds,currentUser:req.user});
        }
    })
//   res.render("campgrounds", { campgrounds: campgrounds });
});

//NEW ROUTE
//FORM render
router.get("/register", (req, res) => {
    res.render('campgrounds/register');
});

//CREATE ROUTE
router.post("/",middleware.isLoggedIn, (req, res) => {
    var author = {
        id: req.user._id,
        username: req.user.username
    }

    var name = req.body.name,
        image = req.body.image,
        description = req.body.description;
    



    var newCampground = {
        name:name,
        image:image,
        description:description,
        author:author
    }    
    Campground.create(newCampground,(error,newlyCreated)=>{
        if(error){
            console.log({error:error});
        }else{
        //     console.log({
        //         success:true,
        //     message:'new camp created',
        //     camp:newCampground
        // });
        console.log(newCampground);
            res.redirect("/campgrounds");
        };
    })
});


//SHOW route
router.get("/:id",(req,res)=>{
    // get the specific id of the instance in the db.
    // THIS IS IN THE REQ.PARAMS SENT WHEN WE CLICK ON THE ANCHOR TAG 
    var id = req.params.id;
    Campground.findById(id).populate("comments").exec((error,foundCamp)=>{
        if(error){
            console.log(error);
        }{
            res.render('campgrounds/show',{camp:foundCamp});
        }   
     })
})

//EDIT

router.get('/:id/edit',middleware.checkCampgroundOwnership,(req,res)=>{
    Campground.findById(req.params.id,(err,foundCamp)=>{
        res.render('campgrounds/edit',{campground:foundCamp});
    })

})

//UPDATE
router.put('/:id',middleware.checkCampgroundOwnership,(req,res)=>{
    var id = req.params.id;
    var update = req.body.campground;
    Campground.findByIdAndUpdate(id,update,(error,updatedCamp)=>{
        if(error){
            console.log(error);
        }else{
            res.redirect('/campgrounds/'+id);
        }
    })
})

//DESTROY CAMPGROUND.
router.delete('/:id',middleware.checkCampgroundOwnership,(req,res)=>{
    var id = req.params.id;
    Campground.findByIdAndRemove(id,(error,deletedCamp)=>{
        if(error){
            console.log(error);
        }else{
            console.log("Deleted Camp!");
            res.redirect('/campgrounds');
        };
    });

});

module.exports = router;


// something just for the show