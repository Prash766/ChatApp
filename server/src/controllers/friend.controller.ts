import mongoose from "mongoose";
import { Events } from "../constants/events";
import { FriendRequest, Status } from "../models/friends.model";
import { User } from "../models/user.model";
import ApiError from "../utils/ApiError";
import asyncHandler from "../utils/asyncHandler";
import { getReceiverSocketId, io } from "../utils/socket";

const pendingRequestList = asyncHandler(async (req, res) => {
  try {
    const pendingList = await FriendRequest.aggregate([
      {
        $match: {
          status: Status.PENDING,
        },
      },
      {
        $lookup: {
          from: "users",
          foreignField: "_id",
          localField: "senderId",
          as: "senderInfo",
          pipeline: [
            {
              $project: {
                _id: 1,
                fullName: 1,
                profilePic: 1,
                email: 1,
                createdAt: 1,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "users",
          foreignField: "_id",
          localField: "receiverId",
          as: "receiverInfo",
          pipeline: [
            {
              $project: {
                _id: 1,
                fullName: 1,
                profilePic: 1,
                email: 1,
                createdAt: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$senderInfo",
        },
      },
      {
        $unwind: {
          path: "$receiverInfo",
        },
      },
    ]);

    console.log("pedning list", pendingList);
    return res.status(200).json({
      success: true,
      pendingList,
    });
  } catch (error: any) {
    console.log(error);
    return res.json({
      message: error.message || "Internal Server Error",
    });
  }
});

const sendRequest = asyncHandler(async (req, res) => {
  const { receiverId } = req.body;
  console.log("receiver id", receiverId);
  try {
    const isRequestExist = await FriendRequest.findOne({
      senderId: req.user,
      receiverId: receiverId,
    }).select("-password");
    console.log("is request sent",isRequestExist)
    if (isRequestExist) {
      const cooldownTIme = isRequestExist.cooldown
      if(cooldownTIme===null){
        return res.status(400).json({
          success: false,
          message: "You have to wait before sending another request.",
        });
      }
      const coolDownTimeExpired =
        Date.now() > new Date(isRequestExist.cooldown).getTime();
        if(coolDownTimeExpired){
          await FriendRequest.findByIdAndUpdate(
            isRequestExist._id,
            {
              $set: { cooldown: null },
            }
          );
        }
      return res.json({
        success: true,
        message: "Request Sent",
      });
    }

    const [friendRequest, senderInfo, receiverInfo] = await Promise.all([
      FriendRequest.create({
        senderId: req.user,
        receiverId: receiverId,
      }),
      User.findById(req.user).select("-password"),
      User.findById(receiverId).select("-password"),
    ]);
    const receiverSocketId = getReceiverSocketId(receiverId) as string;
    const senderId = getReceiverSocketId(req.user) as string;
    console.log("sender id cookie", req.user);
    console.log("sender id", senderId);
    const msg = {
      senderId: req.user,
      receiverId: receiverId,
      payload: {
        friendRequest,
        senderInfo,
        receiverInfo,
      },
    };
    console.log("messsafe 0rirfiu", msg);
    console.log("recvier idddd", receiverSocketId);
    io.to(receiverSocketId).emit(Events.FRIEND_REQUEST_SENT, msg);

    return res.status(200).json({
      success: true,
      message: "Friend Request Sent",
    });
  } catch (error: any) {
    console.log(error);
    return res.status(400).json({
      status: false,
      message: error.message || "Internal Server Error",
    });
  }
});

const acceptFriendRequest = asyncHandler(async (req, res) => {
  const { id, senderId } = req.body;
  try {
    const friendRequest = await FriendRequest.findById(id);
    if (!friendRequest) {
      return res.status(404).json({
        success: false,
        message: "Friend request not found or already processed.",
      });
    }
    const [, , , senderInfo, receiverInfo] = await Promise.all([
      FriendRequest.updateOne(
        { _id: id },
        { $set: { status: Status.ACCEPTED } }
      ),
      User.updateOne({ _id: req.user }, { $addToSet: { friends: senderId } }),
      User.updateOne({ _id: senderId }, { $addToSet: { friends: req.user } }),
      User.findById(senderId).select("-password"),
      User.findById(req.user).select("-password"),
    ]);
    const msg = {
      type: "request-accepted",
      receiverId: req.user,
      senderId: senderId,
      payload: {
        senderInfo,
        receiverInfo,
      },
    };
    console.log("msg", msg);
    const senderSocketId = getReceiverSocketId(senderId) as string;

    io.to(senderSocketId).emit(Events.FRIEND_REQUEST_ACCEPTED, msg);

    res.status(200).json({
      success: true,
      message: "Friend request accepted successfully.",
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error.",
    });
  }
});

const rejectFriendRequest = asyncHandler(async (req, res) => {
  const { senderId, id } = req.body;
  try {
    const isFriend = await FriendRequest.findById(id);
    if (!isFriend) throw new ApiError("Invalid Id", 400);

    const [friendRequest, senderInfo, receiverInfo] = await Promise.all([
      FriendRequest.findByIdAndUpdate(
        id,
        {
          $set: {
            cooldown: Date.now() + 60 * 60 * 24 * 1000,
          },
        },
        { new: true }
      ),

      User.findById(new mongoose.Types.ObjectId(senderId as string)).select(
        "-password"
      ),
      User.findById(new mongoose.Types.ObjectId(req.user as string)).select(
        "-password"
      ),
    ]);

    const senderSocketId = getReceiverSocketId(senderId) as string;
    console.log("sender socket id", senderSocketId);
    const msg = {
      type: "request-rejected",
      senderId: senderId,
      receiverId: req.user,
      payload: {
        friendRequest,
      },
    };
    io.to(senderSocketId).emit(Events.FRIEND_REQUEST_REJECTED, msg);

    res.status(200).json({
      success: true,
      message: "Friend Request Sent",
      friendRequest: {
        senderInfo,
        receiverInfo,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

export {
  sendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  pendingRequestList,
};
