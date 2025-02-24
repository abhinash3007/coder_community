const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors=require("cors");
const http=require("http")
require("dotenv").config();
require("./utils/cronJob");
app.use(cors({
    origin: "http://localhost:5173", // Change this to match your frontend URL
    credentials: true,
    sameSite: 'lax',
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE","OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());
app.use(cookieParser());


const auth=require("./routes/auth");
const profile=require("./routes/profile");
const connectionRequest=require("./routes/connectionRequest")
const userConnectoins=require("./routes/user");
const initializeSocket = require("./utils/socket");

const server=http.createServer(app);
initializeSocket(server)
const connectDB = async () => {
    await mongoose.connect(process.env.DB_CONNECTION_STRING);
};
connectDB()
    .then(() => {
        console.log("connected");
    })
    .catch((err) => {
        console.log(err);
    });


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
server.listen(3000, () => {
    console.log("server is listening");
})