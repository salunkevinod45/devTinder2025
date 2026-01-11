const express = require("express");
const router = express.Router();
const { userAuth } = require("../middlewares/auth");

// Profile route
router.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    return res.status(500).send("Error fetching profile : " + error.message);
  }
});

module.exports = {
    profileRoutes: router
}