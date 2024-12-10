import { UserModel } from "../../models/userModel";
import bcrypt from 'bcrypt';
import { saltRounds } from "../../server";
export async function registerUser(req:any, res:any) {
  try {
    const { username, email, password } = req.body;
    
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds); 

    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword
    });
    await newUser.save();
    return res.status(201).json({ message: 'User registered successfully', user: newUser });

  } catch (error) {
    console.error('Error during registration:', error);
    return res.status(500).json({ message: 'Server error' });
  }
}