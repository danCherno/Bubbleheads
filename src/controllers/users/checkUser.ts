import { RoomUserModel } from "../../models/linkingTable/RoomUserModel";
import { secretKey } from "../../server";
import jwt from 'jwt-simple';


export async function checkUser(token:any):Promise<boolean>
{

    if (!token) {
      console.log("No token found in cookie");
      return false;
    }
  
    try {
      // Decode the token
      const decryptedCookie = jwt.decode(token, secretKey);
     
  
      // Assuming 'userID' is stored in the decoded token
      const userID = decryptedCookie.userId;
     // console.log(userID);
      const foundUser = await RoomUserModel.findOne({ userID});
  
      if (foundUser) {
        console.log("User found:", foundUser);
        return true;
      } else {
        console.log("User not found");
        return false;
      }
    } catch (error) {
      console.error("Error decoding JWT:", error);
      return false;
    }
  }