const express = require("express");
const router = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const mongoose = require("mongoose");
const User = require("../models/user");

// Send Connection Request route

router.post(
  "/connection/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      console.log("Send Connection Request endpoint accessed");
      const allowedStatuses = ["interested", "ignored"];
      const status = req.params.status;
      const toUserId = req.params.toUserId;
      const loggedInUser = req.user;
      const fromUserId = loggedInUser._id;
      if (!toUserId) {
        const err = new Error("toUserId parameter is required");
        err.statusCode = 400;
        throw err;
      }

      if (!mongoose.Types.ObjectId.isValid(toUserId)) {
        const err = new Error("toUserId is not a valid ObjectId");
        err.statusCode = 400;
        throw err;
      }

      if (!mongoose.Types.ObjectId.isValid(fromUserId)) {
        const err = new Error("Logged in user ID is not a valid ObjectId");
        err.statusCode = 400;
        throw err;
      }
      //check whether toUserId is valid ObjectId
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        const err = new Error("invalid connection request recipient");
        err.statusCode = 404;
        throw err;
      }
      // check if connection request already exists
      const existingRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingRequest) {
        const err = new Error(
          "Connection request already exists between these users",
        );
        err.statusCode = 400;
        throw err;
      }
      if (!allowedStatuses.includes(req.params.status)) {
        const err = new Error("Invalid status value");
        err.statusCode = 400;
        throw err;
      }
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      await connectionRequest.save();
      res.send(
        `${loggedInUser.firstName} ${loggedInUser.lastName} ${
          status === "interested" ? "is" : ""
        } ${status} ${status === "interested" ? "in" : ""} ${
          toUser.firstName
        } ${toUser.lastName}`,
      );
    } catch (error) {
      return res
        .status(error?.statusCode || 500)
        .send("Error sending connection request : " + error.message);
    }
  },
);

router.post(
  "/connection/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(requestId)) {
        const err = new Error("requestId is not a valid ObjectId");
        err.statusCode = 400;
        throw err;
      }

      const allowedStatuses = ["accepted", "rejected"];
      if (!allowedStatuses.includes(status)) {
        const err = new Error("Invalid status value");
        err.statusCode = 400;
        throw err;
      }
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });
      if (!connectionRequest) {
        const err = new Error("Connection request not found");
        err.statusCode = 404;
        throw err;
      }
      connectionRequest.status = status;
      await connectionRequest.save();
      res.send(
        `Connection request ${status} by ${loggedInUser.firstName} ${loggedInUser.lastName}`,
      );
    } catch (error) {
      return res
        .status(error?.statusCode || 500)
        .send("Error responding to connection request : " + error.message);
    }
  },
);

router.delete("/removeConnection/:requestId", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const reqId = req.params.requestId;
    if (!mongoose.Types.ObjectId.isValid(reqId)) {
      const error = new Error("Invalid request ID");
      error.status = 400;
      throw error;
    }

    const connectionRequestDetails = await ConnectionRequest.findOneAndDelete({
      status: "accepted",
      _id: reqId,
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    });

    // code for deleting connection request
    if (!connectionRequestDetails) {
      const error = new Error("Invalid request");
      error.status = 400;
      throw error;
    }
    res.json({
      isDeleted:true
    })
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
});

module.exports = {
  requestRoutes: router,
};
