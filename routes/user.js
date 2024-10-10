const express = require("express");
const { userAuth } = require("../middleware/userAuth");
const ConnectionRequest = require("../models/ConnectionRequest");
const router = express.Router();
const User = require("../models/user");

router.get("/user/request", userAuth, async (req, res) => {
    try {
        const currentUser = req.user;
        const connection = await ConnectionRequest.find({
            toUserId: currentUser._id,
            status: "interested"
        }).populate("fromUserId", "firstName lastName age gender photoUrl");
        if (!connection) {
            res.status(404).send({ message: "No requests" });
        }
        res.json({ message: "Data fetched", connection });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.get("/user/connection", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connection = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInUser._id, status: "accepted" },
                { fromUserId: loggedInUser._id, status: "accepted" },
            ],
        }).populate("fromUserId", "firstName lastName age gender photoUrl")
            .populate("toUserId", "firstName lastName age gender photoUrl");
        const data = connection.map((row) => {
            if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId;
            } else {
                return row.fromUserId;
            }
        });
        res.json({ message: "these are your connections", data })
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
})
router.get("/user/feed", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connection = await ConnectionRequest.find({
            $or: [{ fromUserId: loggedInUser._id },
                  { toUserId: loggedInUser._id }
                ]
        }).select("fromUserId toUserId");
        const hideUser = new Set();
        connection.forEach((req) => {
            hideUser.add(req.fromUserId.toString());
            hideUser.add(req.toUserId.toString())
        });

        const user = await User.find({
            $and:[
                {
                    _id: { $nin: Array.from(hideUser) },
                    _id: { $ne: loggedInUser._id }
                }
            ]

        });
        res.send(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})
module.exports = router;