const express=require("express");
const router=express.Router();
const {validationData}=require("../utils/validation");
const bcrypt=require("bcrypt");
const User=require("../models/user");
const jwt=require("jsonwebtoken");


router.post("/signUp", async (req, res) => {
    try {

        // const user= await new User(req.body);
        // const user=new User({
        //     firstName:"Abhinash",
        //     lastName:"Mishra",
        //     email:"abhi@gmail.com",
        //     gender:"male"
        // });
        await validationData(req);
        const { firstName, lastName, email, password,gender,age,photoUrl } = req.body;
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
            gender,
            age,
            photoUrl
        })
        await newUser.save();
        res.send("succesfully user created");
    } catch (err) {
        res.status(400).send("error : " + err.message);
    }
});
router.post("/login", async (req, res) => {
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
router.post("/logout",(req,res)=>{
    res.clearCookie("token");
    res.status(200).send("logout success");
})

module.exports=router;