import multer from 'multer';
import jwt from 'jwt-simple';
import { secretKey } from "../../server";
import { UserModel } from '../../models/userModel';
const upload = multer();
// Upload Route
export async function uploadImage(req: any, res: any) {
    try {
      if (!req.file) return res.status(400).send('No file uploaded.');
      const { user } = req.cookies;
      const decryptedUser= jwt.decode(user,secretKey);
      if(!decryptedUser) throw new Error("error decoding user")
        const id=decryptedUser.userId;
         const userFound =await UserModel.findOne({_id:id});
  
         if(!userFound) throw new Error("user not found!");
  
      const { originalname, mimetype, buffer } = req.file;
        
      userFound.icon = {
        filename: originalname,
        contentType: mimetype,
        data: buffer,
      };
  
      await userFound.save();
  
      res.status(200).send('Image uploaded successfully!');
    } catch (err:any) {
      res.status(500).send('Error uploading image: ' + err.message);
    }
  };
  export const uploadMiddleware = upload.single('image');