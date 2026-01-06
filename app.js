const express = require("express");
const app = express();

const { adminAuth, userAuth } = require("./middlewares/auth");

const connectDB = require("./config/database");
const User = require("./models/user");

const { validateSignupData } = require("./utils/validation");
const bcrypt = require("bcrypt");

app.use(express.json());

app.get("/user", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email }).sort({ _id: 1 });
    if (!user) {
      return res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (error) {
    return res.status(404).send("Error fetching user : " + error.message);
  }
  res.send("User route accessed");
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({}).exec();
    if (users.length) {
      return res.status(200).send(users);
    } else {
      return res.status(404).send("No users found");
    }
  } catch (error) {
    return res.status(404).send("Error fetching feed : " + error.message);
  }
});

app.get("/userById", async (req, res) => {
  try {
    const user = await User.findById(req.body.id);
    if (!user) {
      return res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (error) {
    return res.status(404).send("Error fetching user by ID : " + error.message);
  }
});

app.post("/signup", async (req, res) => {
  // console.log(req.body);
  // Signup logic here
  try {
    // code for validate signup data
    validateSignupData(req);
    //encrypt password before saving to database
    const {firstName,lastName,age,location,gender,email,password,skills} = req.body;
    const passwordHash = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      firstName,
      lastName,
      age,
      location,
      gender,
      email,
      password: passwordHash,
      skills
    });
    await user.save();
    res.send("User signed up successfully");
  } catch (error) {
    res.status(500).send("Error signing up user : " + error.message);
  }
});

app.delete("/user", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.body.userId);
    if (!user) {
      return res.status(404).send("User not found");
    } else {
      res.send("User deleted successfully");
    }
  } catch (error) {
    return res.status(404).send("Error deleting user : " + error.message);
  }
});

// api to update user details by user id
app.patch("/user/:userId", async (req, res) => {
  try {
    const userId = req.params?.userId;
    const allowedUpdates = [
      "firstName",
      "lastName",
      "password",
      "age",
      "location",
      "gender",
      "photoUrl",
      "skills",
      "about",
    ];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );
    const skillsLength = req.body.skills ? req.body.skills.length : 0;
    if (skillsLength > 10) {
      return res
        .status(400)
        .send({ error: "Skills exceeds maximum length of 10" });
    }
    if (!isValidOperation) {
      return res.status(400).send({ error: "Invalid updates!" });
    }
    const user = await User.findByIdAndUpdate(userId, req.body, {
      new: false,
      runValidators: true,
    });
    if (!user) {
      return res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (error) {
    return res.status(404).send("Error updating user : " + error.message);
  }
});

// api to update user details by email
app.patch("/userByEmail/:userEmail", async (req, res) => {
  try {
    const userEmail = req.params?.userEmail;
    const allowedUpdates = [
      "firstName",
      "lastName",
      "password",
      "age",
      "location",
      "gender",
      "photoUrl",
      "skills",
      "about",
    ];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );
    const skillsLength = req.body.skills ? req.body.skills.length : 0;
    if (skillsLength > 10) {
      return res
        .status(400)
        .send({ error: "Skills exceeds maximum length of 10" });
    }
    if (!isValidOperation) {
      return res.status(400).send({ error: "Invalid updates!" });
    }
    const user = await User.findOneAndUpdate({ email: userEmail }, req.body, {
      new: true,
      runValidators: true,
    });
    console.log(user);
    if (!user) {
      return res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (error) {
    return res
      .status(404)
      .send("Error updating user by email : " + error.message);
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
