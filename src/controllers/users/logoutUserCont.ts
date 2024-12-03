import { UserModel } from "../../models/users/userModel";

export async function logoutUser(res:any, req:any) {
  try {
    res.clearCookie('user', { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    return res.status(200).json({ message: 'Logout successful' });

  } catch (error) {
    console.error('Error during logout:', error);
    return res.status(500).json({ message: 'Server error' });
  }
}