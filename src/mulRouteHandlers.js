const express = require('express');

const app = express();

app.get('/list',(req,res,next)=>{

    console.log('route handler 1');
    next();
    
},(req,res,next)=>{
    next();
    // res.send(' route handler 2');
    console.log('route handler 2');

},(req,res,next)=>{
    console.log('route handler 3');
    next();
},[(req,res,next)=>{
    console.log('route handler 4');
    res.send('route handler 4')

}])

app.listen(7777,()=>{
    console.log(' app is running on port 7777');
})