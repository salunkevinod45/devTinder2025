const express = require("express");

const app = express();

const {auth,userAuth} = require("./middlewares/auth")



app.use('/admin',auth);

app.get('/admin/getAllData',(req,res)=>{
    res.send("all admin data send");
})

app.get('/admin/deleteUser',(req,res)=>{
    res.send("user is deleted");
})


app.get('/admin/login',(req,res)=>{
    res.send("admin is logged in");
})

app.use('/user',userAuth);

app.get('/user/login',(req,res)=>{
    res.send("user logged in successfully");
})

app.get('/user/:userId',(req,res)=>{
    res.send("user data fetched successfully");
})

app.get('/user/deleteUser/:userID',(req,res)=>{
    res.send("user deleted successfully");
})


app.listen(9999,()=>{
    console.log('app is running on port 9999')
})