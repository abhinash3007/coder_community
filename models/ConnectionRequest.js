const mongoose=require("mongoose");
const connectionRequestSchema=new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    status:{
        type:String,
        required:true,
        enum:{
           values: ["ignored", "interested", "accept", "rejected"],
      message: "Invalid status. Must be one of: ignored, interested, accept, or rejected"
        }
    }
},{timestamps:true});
module.exports=mongoose.model("ConnectionRequest",connectionRequestSchema);