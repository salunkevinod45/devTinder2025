const express = require("express");
const router = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateProfileUpdateData } = require("../utils/validation");

// Profile route
router.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    return res.status(500).send("Error fetching profile : " + error.message);
  }
});

router.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        // code for validate profile update data
        if (!validateProfileUpdateData(req)) {
            throw new Error("Invalid profile data");
        }
        const loggedInUser = req.user;
        const updates = Object.keys(req.body);
        updates.forEach((update) => {
            loggedInUser[update] = req.body[update];
        });
        await loggedInUser.save();
        res.json({
            message: `${loggedInUser.firstName}, your profile updated successfully`,
            data: loggedInUser
        });
    } catch (error) {
        return res.status(400).send("Error updating profile : " + error.message);
    }
});

module.exports = {
    profileRoutes: router
}