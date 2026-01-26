const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { validateSignupData,validateLoginData,validateForgotPasswordData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const { userAuth } = require("../middlewares/auth");

router.post("/signup", async (req, res) => {
  // Signup logic here
  try {
    // code for validate signup data
    validateSignupData(req);
    //encrypt password before saving to database
    const {
      firstName,
      lastName,
      age,
      location,
      gender,
      email,
      password,
      skills,
    } = req.body;
    const passwordHash = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      firstName,
      lastName,
      age,
      location,
      gender,
      email,
      password: passwordHash,
      skills,
    });
    await user.save();
    res.send("User signed up successfully");
  } catch (error) {
    res.status(500).send("Error signing up user : " + error.message);
  }
});

// login api
router.post("/login", async (req, res) => {
  try {
    // code for validate login data
    validateLoginData(req);
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("User not found");
    }
    console.log("current password login:", req.body.password);
    const isPasswordMatch = await user.validatePassword(password);
    if (!isPasswordMatch) {
      return res.status(400).send("Invalid credentials");
    }
    //create jwt token and send to client
    const token = user.setJWT();
    // res.cookie("token", token, {expires: new Date(Date.now() + 60000)});
    res.cookie("token", token);
    res.json({data:user})
  } catch (error) {
    return res.status(500).send("Error logging in user : " + error.message);
  }
});

router.post("/logout", async (req, res) => {
  try {
    res.clearCookie("token");
    res.send("logout successfully")
  } catch (error) {
    return res.status(500).send("Error logging out user : " + error.message);
  }
});

router.patch("/forgot-password",userAuth, async (req, res) => {
    try {
        validateForgotPasswordData(req);
        const loggedInUser = req.user;
        const {currentPassword,newPassWord } =  req.body;

        const isPasswordMatch = await loggedInUser.validatePassword(currentPassword);
        if (!isPasswordMatch) {
            throw new Error("Current password is incorrect");
        }
        if(currentPassword.trim() === newPassWord.trim()) {
            throw new Error("New password cannot be same as current password");
        }
        const newPasswordHash =  await bcrypt.hash(newPassWord,10);
        loggedInUser.password = newPasswordHash;
        await loggedInUser.save();
        res.send("Password reset successful");
    } catch (error) {
      return res
        .status(500)
        .send("Error in password reset : " + error.message);
    }
});


module.exports = {
    authRoutes: router,
};
