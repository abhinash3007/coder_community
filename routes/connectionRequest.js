const express=require("express");
const router=express.Router();
const ConnectionRequest=require("../models/ConnectionRequest");
const { userAuth } = require("../middleware/userAuth");
const User=require("../models/user");

router.post("/request/send/:status/:toUserId",userAuth ,async(req,res)=>{
    try{
        const fromUserId=req.user._id;
        const toUserId=req.params.toUserId;
        const status=req.params.status;
        const Allowed_Status=["ignored","interested"];
        if(!Allowed_Status.includes(status)){
            throw new Error(`${status} is notmong valid`);
        }
        const user =await User.findById( toUserId );
        if(!user){
            throw new Error("user not present");
        }
        const existingRequest = await ConnectionRequest.findOne({
            $or: [
              { fromUserId: fromUserId, toUserId: toUserId },
              { fromUserId: toUserId, toUserId: fromUserId }
            ]
          });
        if(existingRequest){
            throw new Error("connectoin request already send");
        }
        const connectionRequest=new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });
        const data=await connectionRequest.save();
        res.status(200).json({
            message: `${req.user.firstName} is ${status} in ${user.firstName}`,
            data: data
          });
    }catch(err){
        res.status(400).json({message :err.message});
    }
});

router.post("/request/receive/:status/:requestId",userAuth,async(req,res)=>{
    try{
        const {status,requestId}=req.params;
        const loggedInUser=req.user;
        const Allowed_Staus=["accepted","rejected"];
        if(!Allowed_Staus.includes(status)){
            return res.status(404).json({message:"status is not valid"});
        }
        const isConnection= await ConnectionRequest.findOne({
            _id:requestId,
            toUserId:loggedInUser._id,
            status:"interested"
        });
        if(!isConnection){
            return res.status(404).json({message:"No connection found"});
        }
        isConnection.status=status;
        const data=await isConnection.save();
        res.status(200).json({message:"Connection request "+status,data});
    }catch(err){
        res.status(400).json({message :err.message});
    }
});
module.exports=router;