const express = require("express");
const app = express();

app.use("/",(req,res,next)=>{
    // res.send("testing route");
    next();
})

app.get("/getAllData", (req, res, next) => {
  try {
    throw new Error("some error occurred");
    res.send("successfully fetched all data");
  } catch (err) {
    next(err);
  }
});

app.use("/getAllData", (err, req, res, next) => {
    // console.log(err.stack)
  res.status(500).send(err.message);
});

app.use("/", (err, req, res, next) => {
  if (err) {
    // console.log(err);
    res.status(500).send("something wen wrong 2");
  }
});

app.listen(8888, () => {
  console.log(" node js is running on port number 8888");
});
