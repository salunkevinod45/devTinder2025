const auth = (req,res,next) =>{
    console.log(req.path)
    const token ="xyz";
    if(token === "xyz1" || req.path === "/login") {
        next();
    } else {
        res.status(401).send("unauthorized request");
    }
}

const userAuth = (req,res,next)=>{
    const token = "pqr";

    if(token == "pqr" || req.path === "/login") {
        next();
    } else {
        res.status(401).send("unauthorized request");
    }
}

module.exports = {
    auth,
    userAuth
}

