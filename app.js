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

const { authRoutes } = require("./routes/auth");
const { profileRoutes } = require("./routes/profile");
const { requestRoutes } = require("./routes/request");

app.use("/", authRoutes);
app.use("/", profileRoutes);
app.use("/", requestRoutes);



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
