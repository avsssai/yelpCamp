var mongoose = require('mongoose');

//remove campgrounds and add them again, do the same with the comments.

var Campground = require('./models/campgrounds');
var Comment = require('./models/comments');

var data = [
    {name:"Heaven's Hand",image:"https://s3-media2.fl.yelpcdn.com/bphoto/UztmPophfec6Tw8mnCAPbw/o.jpg",description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."},
    {name:"God's Rest",image:"https://cdn.jacksonholewy.net/images/content/14405_832ba2_gros_ventre_campground_lg.jpg",description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."},
    {name:"Goat's Lair",image:"https://assets.simpleviewinc.com/simpleview/image/fetch/c_fill,h_452,q_75,w_982/http://res.cloudinary.com/simpleview/image/upload/v1469218578/clients/lanecounty/constitution_grove_campground_by_natalie_inouye_417476ef-05c3-464d-99bd-032bb0ee0bd5.png",description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}
]

var comment = {
    author:"Shiva",
    text:"This place is bliss.",

    };
//remove the data.
function seed(){
    Campground.remove({},(err,removed)=>{
        if(err){
            console.log(err);
        }else{
            console.log('Data removed.');
            //add the data back again.
            data.forEach(seed=>{
                Campground.create(seed,(err,createdCamp)=>{
                    if(err){
                        console.log(err);
                    }else{
                        console.log('added campground.');
                        //make a comment on each campground.
                        Comment.create(comment,(err,comment)=>{
                            if(err){
                                console.log(err);
                            }else{
                                createdCamp.comments.push(comment);
                                createdCamp.save();

                                console.log('comment created.');
                            }
                        })
                    }
                })
            })
        }
    })
}

module.exports = seed;