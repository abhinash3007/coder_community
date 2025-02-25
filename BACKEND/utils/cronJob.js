const cron = require("node-cron");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const sendEmail = require("./sendEmail");
const ConnectionRequestModel=require("../models/ConnectionRequest")
cron.schedule(" 0 8 * * *", async () => {
  try {
    const yesterday = subDays(new Date(), 1);
    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);
    const pendingRequest = await ConnectionRequestModel
      .find({
        status: "interested",
        createdAt: {
          $gte: yesterdayStart,
          $lt: yesterdayEnd,
        },
      })
      .populate("fromUserId toUserId");
    const listOfEmails = [
      ...new Set(pendingRequest.map((req) => req.toUserId.email)),
    ];
    //console.log(listOfEmails);
    for (const emails of listOfEmails) {
      try {
        const res = await sendEmail.run(
          "New Friend Requests pending for " + emails,
          "Ther eare so many frined reuests pending, please login to DevTinder.in and accept or reject the reqyests."
        );
       // console.log(res);
      } catch (err) {
        console.log(err);
      }
    }
  } catch (err) {
    console.error(err);
  }
});
