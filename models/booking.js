import mongoose from "mongoose";
import { type } from "os";

const BookingSchema = mongoose.Schema({
    guest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'    
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'room'   
    },
    ckeckInAt: {
        type: Date,
        default: null
    },
    ckeckOutAt: {
        type: Date,
        default: null
    },
    status: {
        enum: ['pending', 'confirmed', 'checked-in', 'checked-out', 'cancelled', 'no-show'],  
        default: 'pending'  
    }

});

const Booking = mongoose.model('booking', BookingSchema);

export default Booking;
