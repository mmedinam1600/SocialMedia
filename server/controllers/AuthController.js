import UserModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Register a new User
export const registerUser = async (req, res) => {
  //const {username, password, firstname, lastname} = req.body;

  const salt = await bcrypt.genSalt(10);
  req.body.password = await bcrypt.hash(req.body.password, salt);
  const {username} = req.body;

  const newUser = new UserModel(req.body);

  try {
    const oldUser = await UserModel.findOne({username});
    if(oldUser) {
      return res.status(400).json({message: "username is already registered"});
    }

    const user = await newUser.save();

    const token = jwt.sign({
      username: user.username,
      id: user._id
    }, process.env.JWT_KEY,  {
      expiresIn: '1h'
    });
    res.status(200).json({user, token});
  } catch (error) {
    res.status(500).json({message: error.message});
  }
}

// Login User

export const loginUser = async (req, res) => {
  const {username, password} = req.body;

  try {
    const user = await UserModel.findOne({username: username});
    if (!user) return res.status(404).json("User or password incorrect");

    const validity = await bcrypt.compare(password, user.password);

    if(!validity) {
      res.status(400).json("Wrong password");
    } else {
      //JWT auth
      const token = jwt.sign({
        username: user.username,
        id: user._id
      }, process.env.JWT_KEY,  {
        expiresIn: '1h'
      });
      res.status(200).json({user, token});
    }


    //validity ? res.status(200).json(user) : res.status(400).json("User or password incorrect");
  } catch (error) {
    res.status(500).json({message: error.message});
  }
}