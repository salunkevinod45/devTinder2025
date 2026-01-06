const adminAuth = ((req, res, next) => {
    console.log("Admin auth middleware");
    const token = "xyz";
    if(token!=="xyz"){
        return res.status(403).send("Access denied");
    }else{
        next();
    }
})

const userAuth = ((req, res, next) => {
    console.log("User auth middleware");
    const token = "abc";
    if(token!=="abc"){
        return res.status(403).send("Access denied");
    }else{
        next();
    }
})

module.exports = {
    adminAuth,
    userAuth
}