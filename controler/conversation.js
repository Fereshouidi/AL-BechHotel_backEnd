import Conversation from "../models/conversation.js";


export const getAllConversation = async () => { console.log('hhhhhhhhhhhhh');

    
    try {
        const allConversation_ = await Conversation.find();
        const allConversation = JSON.stringify(allConversation_, null, 2);
        // console.log('allConversation :' + allConversation );
        
        return allConversation || 'something went wrong !'
    } catch (err) {
        return err
    }

}