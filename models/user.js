import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    userName: {
        type: String,
    },
    dateOfBirth: {
        type: Date,
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
    },
    roomsHistory: [
        {
            room: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'room'
            },
            checkInDate: {
                type: Date,
            },
            checkOutDate: {
                type: Date,
            },
        }
    ]
});

const User = mongoose.model('user', UserSchema);

export default User;
