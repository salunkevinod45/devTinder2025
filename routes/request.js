const express = require("express");
const router = express.Router();
const { userAuth } = require("../middlewares/auth");

// Send Connection Request route

router.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    console.log("Send Connection Request endpoint accessed");
    res.send("Connection request sent successfully");
  } catch (error) {
    return res
      .status(500)
      .send("Error sending connection request : " + error.message);
  }
});

module.exports = {
  requestRoutes: router,
};
