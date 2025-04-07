import express from 'express';
const router = express.Router();
import { addUser } from '../controler/userControler.js';

router.post('/add/user', addUser);

export default router;