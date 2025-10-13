const express = require("express");

const app = express();

app.use("/test", (req, res) => {
  res.send("test path of node js server");
});

app.use("/user", (req, res) => {
  res.send("this is sequence of router matters in node js");
});

app.get("/user", (req, res) => {
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
