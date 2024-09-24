import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { createAccessToken } from "../libs/jwt.js";

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new userModel({
      username,
      email,
      password: passwordHash,
    });

    const userSaved = await newUser.save();
    const token = await createAccessToken({ id: userSaved._id });

    res.cookie("token", token);
    res.json({
      id: userSaved._id,
      username: userSaved.username,
      email: userSaved.email,
      createdAt: userSaved.createdAt,
      updatedAt: userSaved.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

  res.send("registrando");
};

export const login = async (req, res) => {
  
  try {
    
    const { email, password } = req.body;
    const userFound = await userModel.findOne({email})

    if (!userFound)
      return res.status(400).json({
        message: ["The email does not exist"],
      });
    
    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch) {
      return res.status(400).json({
        message: ["The password is incorrect"],
      });
    }
    const token = await createAccessToken({ id: userFound._id });

    res.cookie("token", token);
    res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      createdAt: userFound.createdAt,
      updatedAt: userFound.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

  res.send("registrando");
};

export const logout = (req, res) => {

  res.cookie('token', "", {
    expires: new Date(0)
  })
  return res.sendStatus(200)
}

export const profile = async(req, res) =>{
  
  
  const profileData = await userModel.findById(req.user.id)

  if(!profileData) return res.status(400).json({message: "User not found"})

  return res.json({
    id: profileData._id,
    username: profileData.username,
    email: profileData.email,
    createdAt: profileData.createdAt,
    updatedAt: profileData.updatedAt
  })
  // console.log(profileData)
}
