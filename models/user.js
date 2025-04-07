import mongoose from "mongoose";
import { type } from "os";

const UserSchema = mongoose.Schema({
    userName: {
        type: String,
    },
    dateOfBirth: {
        type: String,
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
    },
    roomNumber: {
        type: String,
    },
    checkInDate: {
        type: String,
    },
    checkOutDate: {
        type: String,
    },
    key: {
        type: String,
    },
    conversation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
    }

});

const User = mongoose.model('user', UserSchema);

export default User;
