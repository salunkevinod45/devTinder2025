const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const userRouter = express.Router();

const userSafeFields = 'firstName lastName email gender skills photoUrl age about';


userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({ toUserId: loggedInUser._id, status: 'interested' }).populate('fromUserId', userSafeFields);
    res.status(200).json({
      data: connectionRequests
    });
  } catch (error) {
    return res
      .status(error?.statusCode || 500)
      .send("Error fetching received requests: " + error.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connections = await ConnectionRequest.find({ 
      $or: [
        { fromUserId: loggedInUser._id, status: 'accepted' },
        { toUserId: loggedInUser._id, status: 'accepted' }
      ]
    }).populate('fromUserId toUserId', userSafeFields);

    const data = connections.map(conn => {
      let connectedUser = null;
      if (conn.fromUserId._id.toString() === loggedInUser._id.toString()) {
        connectedUser = conn.toUserId;
      } else {
        connectedUser = conn.fromUserId;
      }
      return { connectionId: conn._id, user: connectedUser };
    });

    res.status(200).json({
      data
    });

  } catch (error) {
    return res
      .status(error?.statusCode || 500)
      .send("Error fetching connections: " + error.message);
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = Math.min(limit, 50);
    const skip = (page - 1) * limit;

    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({ 
      $or: [
        { fromUserId: loggedInUser._id},
        { toUserId: loggedInUser._id}
      ]
    }).select('fromUserId toUserId');

    const hideUsersFromFeed = new Set();
    connectionRequests.forEach(request => {
      hideUsersFromFeed.add(request.fromUserId.toString());
      hideUsersFromFeed.add(request.toUserId.toString());
    });

    console.log("Users to hide from feed:", hideUsersFromFeed);

    const connections = await User.find({
      $and: [
        { _id: { $ne: loggedInUser._id } },
        { _id: { $nin: Array.from(hideUsersFromFeed) } }
      ]
    }).select(userSafeFields).skip(skip).limit(limit);

    res.json({
      data:connections
    });
  } catch (error) {
    return res
      .status(error?.statusCode || 500)
      .send("Error fetching user feed: " + error.message);
  }
});

module.exports = { userRouter };