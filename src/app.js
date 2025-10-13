const express = require("express");

const app = express();

app.get(/^\/a(b)?cd$/,(req,res)=>{
  res.send('optional routes')
})

app.get(/^\/vinod(salunke)?test$/,(req,res)=>{
  res.send('optional word')
})

app.get(/^\/vinod*salunke$/,(req,res)=>{
  res.send('multiple optional letter d in between are allowed');
})

app.get(/^\/vinod(.*)salunke$/,(req,res)=>{
  res.send('multiple optional words in between vinod and salunke are allowed');
})

app.get(/^\/ab(xy)+cd$/,(req,res)=>{
  res.send('multiple times xy are allowed');
})

app.get(/^.*salunke$/,(req,res)=>{
  res.send('start with anything but end with salunke');
})

app.get(/^\/vinod(.*)$/,(req,res)=>{
 res.send('site details with query parameters')
})

app.get('/sitesdemo',(req,res)=>{
  console.log(req.query);
 res.send('site details with query parameters')
})


app.get('/sites/:siteId/:name',(req,res)=>{
  console.log(req.params);
 res.send('site details with params')
})

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
