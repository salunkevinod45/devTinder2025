const cron = require("node-cron");

cron.schedule("* * * * *",()=>{
    console.log("running task after every minute")
})