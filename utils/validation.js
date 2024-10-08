const express=require("express");
const validator=require("validator");

const validationData=async(req)=>{
    const {firstName,lastName,email,password}=req.body;
    if(!firstName || !lastName){
        throw new Error("Name is not valid");
    }else if(!validator.isEmail(email)){
        throw new Error("email not valid");
    }else if (!validator.isStrongPassword(password)) {
        throw new Error("Please enter a strong Password!");
    }
}
const validationProfileEdit=async(req,res)=>{
        const Allowed_Methods=["firstName","lastName","gender","age","photoUrl"];
        const isAlowed=Object.keys(req.body).every((field)=>{
            Allowed_Methods.includes(field)
        });
        return isAlowed;
}
module.exports={validationData,validationProfileEdit};