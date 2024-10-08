const express=require("express");
const router=express.Router();
const {userAuth}=require("../middleware/userAuth");
const { validationProfileEdit } = require("../utils/validation");
router.get("/profile/view", userAuth,async (req, res) => {
    try {
        const user=req.user;
        res.send(user);
    } catch (err) {
        res.status(404).send(err.message);
    }
});
router.patch("/profile/edit", userAuth,async (req, res) => {
    try{
        if(!validationProfileEdit){
            throw new Error("This cannot be included");
        }
        const user=req.user;
        Object.keys(req.body).forEach((key)=>(user[key]=req.body[key]));
        res.status(200).send({ message: `${user.firstName}, updates successful`, data: user });

    }catch (err) {
        res.status(404).send(err.message);
    }
})
module.exports=router;