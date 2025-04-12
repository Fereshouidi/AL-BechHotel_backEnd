import mongoose from "mongoose";
import { type } from "os";

const RoomSchema = mongoose.Schema({
    number: {
        type: String,
    },
    guestsHistory: {
        type: [{
            guest: {
                type: mongoose.Types.ObjectId,
                ref: 'user'
            },
            ckeckInAt: {
                type: Date,
                default: null
            },
            ckeckOutAt: {
                type: Date,
                default: null
            }
        }],
    },
    type: {
        type: String,
        enum: ['single', 'double', 'triple', 'quad'],
    },    
    key: {
        type: String,
        default: '0000'
    },
    isAvalable: {
        type: Boolean,
        default: false
    }

});

const Room = mongoose.model('room', RoomSchema);

export default Room;
