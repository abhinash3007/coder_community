const mongoose=require("mongoose");
const validator=require("validator");
const userSchems=mongoose.Schema({
    firstName:{
        type:String,
        minLength:4,
        maxLength:40
    },
    lastName:{
        type:String
    },
    email:{
        type:String,
        required:true,
        validator(validator){
            if(!validator.isEmail(value)){
                throw new Error("Enter a good email");
            }
        }
    },
    gender:{
        type:String
    },
    age:{
        type:Number,
        min:18,
        max:100,
    },
    password:{
        type:String,
        required:true,
        validator(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Password is not strong");
            }
        }
    },
    photiUrl:{
        type:String,
        default:"https://www.pngmart.com/files/23/Profile-PNG-Photo.png"
    }
});
module.exports=mongoose.model("User",userSchems);