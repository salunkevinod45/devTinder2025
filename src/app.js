const express = require("express");

const app = express();



app.use("/hello", (req, res) => {
  res.send("Hello world test demo vinod");
});

app.use("/test",(req,res)=>{
res.send('test path of node js server')
})

app.use("/", (req, res) => {
  res.send("Dashboard of node js is first program");
});



app.listen(7777, () => {
  console.log("server is running on port number 7777");
});
