import Conversation from "../models/conversation.js";
import { receptionistAgent, datacollectorAgent } from "../gemini/agents.js";
import { promptForReceptionistAgent, promptForDataCollectorAgent } from "../gemini/agents.js";
import User from "../models/user.js";
import Gemini from "../gemini/gemini.js";
import { updateUser } from "./userControler.js";

export const handleAddChat = async (chat) => {

    try {
        const newChat = await new Chat(chat);
        newChat.save();
        return newChat;
    } catch (err) {
        console.log(err);
        return null;
    }
}

export const handleAiAnswer = async (req, res) => {

    const { userId, message, conversationId } = req.body;
    
    //console.log({ userId, message, conversationId });
    

    try {

        let conversation = null;
        let user = null;
        let answer = null;


        try {
            conversation = await Conversation.findOne({_id: conversationId}).populate('user');
        } catch (err) {
            console.log('conversation not exist');
        }

        
        try {
            user = await User.findOne({_id: userId});        
        } catch (err) {
            console.log('conversation not exist');
        }

        if (!user) {

            const newuser = new User({
                conversation: conversation
            })

            await newuser.save();

            user = await User.findOne({_id: newuser._id});

        }
        
        if (!conversation) {
            const newChat = await receptionistAgent.getChat([
                {
                  role: "user",
                  parts: [{ text: promptForReceptionistAgent }],
                },
                {
                  role: "model",
                  parts: [{ text: "ok, i'm ready" }],
                },
              ]);            

            const newConversation = new Conversation({
                user: user,
                chat: newChat
            })

            newConversation.chat = newChat;
            newConversation.updatedAt = new Date();
            await newConversation.save();

            conversation = await Conversation.findOne({_id: newConversation._id}).populate('user');

            
            answer = await newChat.sendMessage({
                message: message,
            });
            

        } else {
            const chat = await receptionistAgent.getChat(conversation.chat.history);
            
            answer = await chat.sendMessage({
                message: message,
            });

            conversation.chat = chat
            conversation.updatedAt = new Date();
            await conversation.save();
        }

        await checkSymbols(answer.text, userId);

        res.status(200).json({
            answer: answer.text,
            updatedUser: user,
            updatedConversation: conversation
        });


    } catch (err) {
        res.status(500).json({error: err.Message});
        console.log(err);
        
    }
};

const checkSymbols = async (message, userId) => {

    message.includes('h4h4') && await checkUpdateUser(message, userId);

}

const checkUpdateUser = async (message, userId) => {

    const newChat = await datacollectorAgent.getChat([
        {
            role: "user",
            parts: [{ text: promptForDataCollectorAgent }],
        },
        {
            role: "model",
            parts: [{ text: "ok, i'm ready" }],
        },
        ]);
    
        const answer = await newChat.sendMessage({
            message: message,
        });

        const userData = JSON.parse(answer.text);

        const updatedUser = await updateUser(userId, userData)

        console.log(updatedUser);
    

}