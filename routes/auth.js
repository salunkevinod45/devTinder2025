const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { validateSignupData,validateLoginData } = require("../utils/validation");
const bcrypt = require("bcrypt");

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
    const isPasswordMatch = user.validatePassword(password);
    if (!isPasswordMatch) {
      return res.status(400).send("Invalid credentials");
    }
    //create jwt token and send to client
    const token = user.setJWT();
    // res.cookie("token", token, {expires: new Date(Date.now() + 60000)});
    res.cookie("token", token);
    res.send("User logged in successfully");
  } catch (error) {
    return res.status(500).send("Error logging in user : " + error.message);
  }
});


module.exports = {
    authRoutes: router,
};
