var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
    username : String,
    password : String
});


var User = module.exports = mongoose.model('User',UserSchema);

//method for hashing the password and saving it in the DB.
module.exports.createUser = (newUser,callback)=>{
    bcrypt.genSalt(10,(err,salt)=>{
        if(err)throw err;
        bcrypt.hash(newUser.password,salt,(err,hash)=>{
            //save the password as hash here.
            newUser.password = hash;
            newUser.save(callback);
        })
    })
};


// module.exports.comparePassword = (passwordEntry,hash,callback)=>{
//     bcrypt.compare(passwordEntry,hash,(err,isMatch)=>{
//         if(err){
//             throw err;
//         }if(isMatch){
//             callback(null,isMatch);
//         }
//     })
// }


module.exports.getUserByUsername = (username,callback)=>{
    var query = {username:username};
    User.findOne({username:username},callback);
}

module.exports.comparePassword = (userPassword,hash,callback)=>{
    bcrypt.compare(userPassword,hash,(err,isMatch)=>{
        if(err){
            console.log(err);
        }else{
            callback(null,isMatch);
        }
    });
}