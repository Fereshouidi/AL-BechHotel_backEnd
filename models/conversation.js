import mongoose from "mongoose";
import { type } from "os";

const ConversationSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    chat: {
        type: Object
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const Conversation = mongoose.model('conversation', ConversationSchema);

export default Conversation;