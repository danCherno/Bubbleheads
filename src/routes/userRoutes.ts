import express from 'express';
import { loginUser } from '../controllers/users/loginUserCont';
import { registerUser } from '../controllers/users/registerUserCont';
import { logoutUser } from '../controllers/users/logoutUserCont';
import { getAllUsers } from '../controllers/users/getAllUsersCont';




const router = express.Router();

router.post('/login-user', loginUser);
router.post('/register-user', registerUser);
router.post('/logout-user', logoutUser);
router.get('/get-all-users', getAllUsers);



export default router;