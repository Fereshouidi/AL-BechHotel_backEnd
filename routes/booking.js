import express from 'express';
const router = express.Router();
import { handleAddBooking } from '../controler/bookingController';

router.post('/add/booking', handleAddBooking);

export default router;