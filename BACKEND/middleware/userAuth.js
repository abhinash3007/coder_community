const jwt=require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res,next) => {
    try {
        const cookie = req.cookies;
        const { token } = cookie;
        if (!token) {
            return res.status(401).send("Need to log in first. Please Login!");
        }
        const decode = await jwt.verify(token, process.env.JWT_SECRET);
        const { _id } = decode;
        const user = await User.findById(_id);
        if (!user) {
            throw new Error("No user present");
        }
        req.user=user;
        next();
    } catch (err) {
        res.status(404).send(err.message);
    }
}
module.exports = {userAuth};