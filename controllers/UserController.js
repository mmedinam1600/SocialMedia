import UserModel from "../models/userModel.js";
import bcrypt from "bcrypt";

// get a User
export const getUser = async (req, res) => {
  const {id} = req.params;

  try {
    const user = await UserModel.findById(id);

    if (!user) return res.status(404).json("No such user exists");

    const {password, ...otherDetails} = user._doc;
    res.status(200).json(otherDetails);
  } catch (error) {
    res.status(500).json(error);
  }
}


// update a user
export const updateUser = async (req, res) => {
  const {id} = req.params;
  const {currentUserId, currentUserAdminStatus, password} = req.body;
  const hasPermission = id === currentUserId || currentUserAdminStatus;
  if (!hasPermission) return res.status(403).json("Access Denied! you can only update your own profile");

  try {
    if (password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(password, salt);
    }

    const user = await UserModel.findByIdAndUpdate(id, req.body, {new: true});
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
}

// Delete user
export const deleteUser = async (req, res) => {
  const {id} = req.params.id;
  const {currentUserId, currentUserAdminStatus} = req.body;
  const hasPermission = currentUserId === id || currentUserAdminStatus;
  if (!hasPermission) return res.status(403).json("Access Denied! you can only delete your own profile");

  try {
    await UserModel.findByIdAndDelete(id);
    res.status(200).json("User deleted successfully");
  } catch (error) {
    res.status(500).json(error);
  }
}

// Follow a user
export const followUser = async (req, res) => {
  const {id} = req.params;
  const {currentUserId} = req.body;
  const isTheSameUser = currentUserId === id;

  if (isTheSameUser) return res.status(403).json("Action forbidden");

  try {
    const followUser = await UserModel.findById(id); // The user that you follow
    const followingUser = await UserModel.findById(currentUserId); // Your user

    if (followUser.followers.includes(currentUserId)) return res.status(403).json("User is Already Followed by you");

    await followUser.updateOne({$push: {followers: currentUserId}});
    await followingUser.updateOne({$push: {following: id}});
    res.status(200).json("User followed!");

  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}

// UnFollow a User
export const UnFollowUser = async (req, res) => {
  const {id} = req.params;
  const {currentUserId} = req.body;
  const isTheSameUser = currentUserId === id;

  if (isTheSameUser) return res.status(403).json("Action forbidden");

  try {
    const followUser = await UserModel.findById(id); // The user that you follow
    const followingUser = await UserModel.findById(currentUserId); // Your user

    if (!followUser.followers.includes(currentUserId)) return res.status(403).json("User is not followed by you");

    await followUser.updateOne({$pull: {followers: currentUserId}});
    await followingUser.updateOne({$pull: {following: id}});
    res.status(200).json("User Unfollowed!");

  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}