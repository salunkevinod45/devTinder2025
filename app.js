const express = require("express");
const app = express();

const { userAuth } = require("./middlewares/auth");

const connectDB = require("./config/database");
const User = require("./models/user");

const { validateSignupData, validateLoginData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  // console.log(req.body);
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
app.post("/login", async (req, res) => {
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

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    return res.status(500).send("Error fetching profile : " + error.message);
  }
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    console.log("Send Connection Request endpoint accessed");
    res.send("Connection request sent successfully");
  } catch (error) {
    return res
      .status(500)
      .send("Error sending connection request : " + error.message);
  }
});

// Connect to the database
connectDB()
  .then(() => {
    console.log("main code");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database:", err);
  });
