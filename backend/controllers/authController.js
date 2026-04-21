import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from "dotenv";
dotenv.config();

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashPassword });
 
    res.status(201).json({message:"User registered successfully",user});
    
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
    const isProduction = process.env.NODE_ENV === "production";

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
   if(!user) {
    return res.status(400).json({ message: 'Invalid User' });
   }
   const isMatch = await bcrypt.compare(password, user.password);
   if(!isMatch){
    return res.status(400).json({ message: 'Invalid Password' });
   }
   const token = jwt.sign({
    id: user._id,
    name:user.name,
    email:user.email
   },
   process.env.JWT_SECRET,
   {expiresIn:'1d'})
   res.cookie("token",token,{
    httpOnly:true,sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    path:"/",
   })
    res.json({message:"Login successful",token,user});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
