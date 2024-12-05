import express from 'express';
import { addRoom } from '../../controllers/rooms/addRoomsCont';
import { getRooms } from '../../controllers/rooms/getRoomsCont';
import { getRoomPopulation } from '../../controllers/rooms/getRoomPopulationCont';
import { enterRoom } from '../../controllers/rooms/enterRoom';
import { leaveRoom } from '../../controllers/rooms/leaveRoomCont';



const router = express.Router();

router.post('/add-room',addRoom);
router.post('/get-room-population',getRoomPopulation);
router.post('/enter-room',enterRoom);
router.post('/leave-room',leaveRoom);
router.get('/get-room',getRooms);


export default router;