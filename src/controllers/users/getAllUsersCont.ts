import { UserModel } from "../../models/users/userModel";

export async function getAllUsers(req:any, res:any) {
  try {
    const users = await UserModel.find(); 

    if (!users || users.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }

    return res.status(200).json({ users });
    
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ message: 'Server error' });
  }
}