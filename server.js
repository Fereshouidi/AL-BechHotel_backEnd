import express from 'express';
import cors from 'cors';
import conn from './connection.js';
import UserRouter from './routes/user.js';
import ChatRouter from './routes/conversation.js';
// import BookingRouter from './routes/booking.js';
import RoomRouter from './routes/room.js';
// import Gemini from './gemini.js';

const app = express();
const port = 3002 || process.env.PORT;
app.use(express.json());
app.use(cors());

app.use('/api', UserRouter);
app.use('/api', ChatRouter);
app.use('/api', RoomRouter);



app.listen(port, () => {
    console.log('server wort at the port ', port);
})