import express from 'express';
const router = express.Router();
import { handleAddRoom } from '../controler/roomController.js';

router.post('/add/room', handleAddRoom);

export default router;