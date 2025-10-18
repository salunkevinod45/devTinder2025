const express = require("express");

const app = express();




app.get("/user/:userId/:userName", (req, res) => {
  console.log(req.params);
  res.send({ firstName: "Vinod", lastName: "Salunke" });
});

app.post("/user", (req, res) => {
  res.send("data saved into the database successfully");
});

app.put("/user", (req, res) => {
  res.send("user data updated into the database successfully");
});

app.patch("/user", (req, res) => {
  res.send("user name updated into the database successfully");
});

app.delete("/user", (req, res) => {
  res.send("user deleted from the database successfully");
});

app.listen(7777, () => {
  console.log("server is running on port number 7777");
});
