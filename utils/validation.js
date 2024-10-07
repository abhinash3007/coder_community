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
module.exports={validationData};