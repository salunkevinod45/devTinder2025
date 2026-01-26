const jwt = require("jsonwebtoken");

const user = require("../models/user");

const userAuth = async(req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send('unauthorized user, please login again')
    }
    const decodedToken = jwt.verify(token,'secretKey');
    const userId = decodedToken.userId;
    if(!userId) {
      throw new Error("Invalid token: User ID missing");
    }
    const userData = await user.findById(userId);
    if (!userData) {
      return res.status(401).send("Unauthorized: User not found");
    }
    req.user = userData;
    next();
  } catch (error) {
    return res.status(401).send("Unauthorized: " + error.message);
  }
};

module.exports = { userAuth };
