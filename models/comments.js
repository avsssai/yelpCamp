var mongoose = require('mongoose');
// var Campground = require('./models/campgrounds.js');

//comment schema
var commentSchema =  mongoose.Schema({
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref : "User"
        },
        username:String
    },
    text:String
});

module.exports = mongoose.model("Comment",commentSchema);