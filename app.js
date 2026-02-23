const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");

const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("./utils/cronjob");

const allowedOrigins = [
  "http://localhost:5173"
];

app.use(cors({
  origin:allowedOrigins,
  credentials:true
}))
app.use(express.json());
app.use(cookieParser());

const { authRoutes } = require("./routes/auth");
const { profileRoutes } = require("./routes/profile");
const { requestRoutes } = require("./routes/request");
const { userRouter } = require("./routes/user");
const paymentRouter = require("./routes/payments");
require("./utils/dateOperations");

app.use("/", authRoutes);
app.use("/", profileRoutes);
app.use("/", requestRoutes);
app.use("/", userRouter);
app.use("/payments", paymentRouter);



// Connect to the database
connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database:", err);
  });
