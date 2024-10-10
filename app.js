const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const auth=require("./routes/auth");
const profile=require("./routes/profile");
const connectionRequest=require("./routes/connectionRequest")
const userConnectoins=require("./routes/user")
const connectDB = async () => {
    await mongoose.connect("mongodb://localhost:27017/CODE_COMMUNITY");
};

connectDB()
    .then(() => {
        console.log("connected");
    })
    .catch((err) => {
        console.log(err);
    });
app.use(express.json());
app.use(cookieParser())

// app.get("/getData", async (req, res) => {
//     try {
//         const user = await User.find({});
//         res.status(200).send(user);
//     } catch (err) {
//         res.status(404).send("user not found");
//     }
// });
// app.delete("/delete", async (req, res) => {
//     try {
//         const userId = req.body.userId;
//         const user = await User.findByIdAndDelete(userId);
//         res.status(200).send("user deleted successfully");
//     } catch (err) {
//         res.status(404).send("user not found");
//     }
// })
// app.patch("/update", async (req, res) => {
//     try {
//         const userId = req.body.userId;
//         console.log(userId);
//         const user = await User.findByIdAndUpdate(userId, { firstName: 'jason' });
//         res.status(200).send(user);
//     } catch (err) {
//         res.status(404).send("user not found");
//     }
// })
app.use("/",auth);
app.use("/",profile);
app.use("/",connectionRequest);
app.use("/",userConnectoins);

// app.get("/user",(err,req,res,next)=>{
//     if(err){
//         res.status(401).send("error");
//     }else{
//         res.send("hello2");
//     }
// })
app.get("/", (req, res) => {
    res.send("hello");
})
app.listen(3000, () => {
    console.log("server is listening");
})