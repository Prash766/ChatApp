import { FriendRequest, Status } from "../models/friends.model";
import { User } from "../models/user.model";
import asyncHandler from "../utils/asyncHandler";

const sendRequest = asyncHandler(async (req, res) => {
  const { receiverId } = req.body;
  console.log("receiver id", receiverId)
  try {
    const friendRequest = await FriendRequest.create({
      senderId: req.user,
      receiverId: receiverId,
    });
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
  const { receiverId } = req.body;
  try {
    const friendRequest = await FriendRequest.findOne({
      senderId: req.user,
      receiverId: receiverId,
      status: Status.PENDING,
    });

    if (!friendRequest) {
      return res.status(404).json({
        success: false,
        message: "Friend request not found or already processed.",
      });
    }

    await Promise.all([
      FriendRequest.updateOne(
        { senderId: req.user, receiverId: receiverId, status: Status.PENDING },
        { $set: { status: Status.ACCEPTED } }
      ),
      User.updateOne({ _id: req.user }, { $addToSet: { friends: receiverId } }),
      User.updateOne({ _id: receiverId }, { $addToSet: { friends: req.user } }),
    ]);

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
  const { receiverId } = req.body;
  try {
    const friendRequest = await FriendRequest.updateOne({
      senderId: req.user,
      receiverId: receiverId,
      status: Status.REJECTED,
    });
    res.status(200).json({
      success: true,
      message: "Friend Request Sent",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

export { sendRequest, acceptFriendRequest, rejectFriendRequest };
