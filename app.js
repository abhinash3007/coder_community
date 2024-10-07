const express = require("express");
const app = express();
const mongoose = require("mongoose");
const User = require("./models/user");
//const validator = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { validationData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const {userAuth}=require("./middleware/userAuth");
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

app.post("/signUp", async (req, res) => {
    try {

        // const user= await new User(req.body);
        // const user=new User({
        //     firstName:"Abhinash",
        //     lastName:"Mishra",
        //     email:"abhi@gmail.com",
        //     gender:"male"
        // });
        await validationData(req);
        const { firstName, lastName, email, password } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            throw new Error("User Exits");
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
        })
        await newUser.save();
        res.send("succesfully user created");
    } catch (err) {
        res.status(400).send("error : " + err.message);
    }
});
app.get("/getData", async (req, res) => {
    try {
        const user = await User.find({});
        res.status(200).send(user);
    } catch (err) {
        res.status(404).send("user not found");
    }
});
app.delete("/delete", async (req, res) => {
    try {
        const userId = req.body.userId;
        const user = await User.findByIdAndDelete(userId);
        res.status(200).send("user deleted successfully");
    } catch (err) {
        res.status(404).send("user not found");
    }
})
app.patch("/update", async (req, res) => {
    try {
        const userId = req.body.userId;
        console.log(userId);
        const user = await User.findByIdAndUpdate(userId, { firstName: 'jason' });
        res.status(200).send(user);
    } catch (err) {
        res.status(404).send("user not found");
    }
})
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            throw new Error("please enter full details");
        }
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error("invalid");
        }
        const originalPass = await bcrypt.compare(password, user.password);
        const token = await jwt.sign({ _id: user._id }, "abhinash3007");
        res.cookie("token", token);
        if (!originalPass) {
            throw new Error("Invalid");
        } else {
            res.status(201).send("login succes");
        }
    } catch (err) {
        res.status(404).send(err.message);
    }
});
app.get("/profile", userAuth,async (req, res) => {
    try {
        const user=req.user;
        res.send(user);
    } catch (err) {
        res.status(404).send(err.message);
    }
});
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