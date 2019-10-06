var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/dogs',{useNewUrlParser:true,useUnifiedTopology:true});

var dogSchema = mongoose.Schema({
    name:String,
    age:Number,
    breed:String
})

var Dog = mongoose.model("Dog",dogSchema);


// Dog.insertMany([
//     {name:'lily',age:'12',breed:'mutt'},
// {name:'Rob',age:'1',breed:'Poodle'},
// {name:'Geb',age:'10',breed:'Labrador'}])
var newDog = new Dog({
            name:'browny',age:'12',breed:'mutt'

});

// newDog.save((err,dog)=>{
//     if(err){
//         console.log("Something went wrong!");
//     }else{
//         console.log("Dog saved to the database.");
//         console.log(dog);
//     }
// })


Dog.find({},(err,dogs)=>{
    if(err){
        console.log({success:false,errorMessage:"Cannot find the dogs in the DB.",error:error});
    }else{
        console.log({success:true,dogs:dogs});
    }
})