import Conversation from "../models/conversation.js";


export const getAllConversation = async () => {
    
    try {
        const allConversation = await Conversation.find();
        return allConversation
    } catch (err) {
        return err
    }

}