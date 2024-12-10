import express from 'express';
import { isAuthorized } from '../../controllers/lobby/isAuthorized';
import { getLobbyUsers } from '../../controllers/lobby/getLobbyUsers';
import { getLobbyMessages } from '../../controllers/lobby/getLobbyMessages';

const router = express.Router();

router.post('/isAuthorized', isAuthorized)
router.post('/getLobbyUsers', getLobbyUsers);
router.post('/getLobbyMessages', getLobbyMessages);

export default router;