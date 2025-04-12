import express from 'express';
const router = express.Router();
import { handleAddChat, handleAiAnswer } from '../controler/conversationControler.js';

router.post('/add/chat', async (req, res) => {
    const  { chat } = req.body;

    try {
        
        const newChat = await handleAddChat(chat);
        res.status(201).json(newChat);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

router.post('/getAiAnswer', async (req, res) => {
    let { userId, message, conversationId } = req.body;
    handleAiAnswer({userId, message, conversationId, req, res})
})

export default router;