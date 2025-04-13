import Conversation from "../models/conversation.js";
import { agent } from "../gemini/agents.js";
import { promptForAgent } from "../gemini/agents.js";
import User from "../models/user.js";
import Gemini from "../gemini/gemini.js";
import Room from "../models/room.js";
import { getAllRooms, updateRooms } from "./roomController.js";
import { getAllUsers, updateUsers } from "./userControler.js";
import { getAllConversation } from "./conversation.js";

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

export const handleAiAnswer = async ( {userId, message, conversationId, req, res} ) => {

    try {

        let conversation = null;
        let user = null;
        let answer = null;
        message = `<mfc>${message}</mfc>` + `/n/n (this message's date is ${new Date()} /n/n (sender: the user with this id(${userId}))`;


        try {
            conversation = await Conversation.findOne({_id: conversationId}).populate('user');
        } catch (err) {
            console.log('conversation not exist');
        }

        
        try {
            user = await User.findOne({_id: userId});        
        } catch (err) {
            console.log('user not exist');
        }

        if (!user) {

            const newuser = new User({
                conversation: conversation
            })

            await newuser.save();

            user = await User.findOne({_id: newuser._id});

        }
        
        if (!conversation) {
            const newChat = await agent.getChat([
                {
                  role: "user",
                  parts: [{ text: promptForAgent }],
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
            const chat = await agent.getChat(conversation.chat.history);
            
            answer = await chat.sendMessage({
                message: message,
            });

            conversation.chat = chat
            conversation.updatedAt = new Date();
            await conversation.save();
        }

        await checkSymbols( {userId, message: answer.text, conversationId, req, res} );

        console.log(answer.text);
        
        if (answer.text.includes('</mfc>')) {
            res.status(200).json({
                answer: answer.text,
                updatedUser: user,
                updatedConversation: conversation
            });
    
        }


    } catch (err) {
        res.status(500).json({error: err.Message});
        console.log(err);
        
    }
};

const checkSymbols = async ( {userId, message, conversationId, req, res} ) => {
    
    if (message.includes('<roomsData/>')) {
        const allRooms = await getAllRooms();
        await handleAiAnswer({userId, message: String(allRooms), conversationId, req, res})
    }
    if (message.includes('<usersData/>')) {
        const allUsers = await getAllUsers();
        await handleAiAnswer({userId, message: String(allUsers), conversationId, req, res})
    } 
    if (message.includes('<conversations/>')) {
        const allConversation = await getAllConversation();
        console.log('allConversation : ' + allConversation);
        
        await handleAiAnswer({userId, message: String(allConversation), conversationId, req, res})
    } 
    if (message.includes('<updatedRooms>')) {

        let updatedRooms = [];
    
        try {
            const start = message.indexOf('<updatedRooms>') + '<updatedRooms>'.length;
            const end = message.indexOf('</updatedRooms>');
            updatedRooms = JSON.parse(message.slice(start, end));
        } catch (err) {
            const start = message.indexOf('<updatedRooms>') + '<updatedRooms>'.length;
            const end = message.indexOf('</updatedRooms>');
            console.log('aaa', message.slice(start, end));
        }      

        const result = await updateRooms(updatedRooms);
        await handleAiAnswer({userId, message: String(result), conversationId, req, res})
    } 
    if (message.includes('<updatedUsers>')) {

        let updatedUsers = [];
    
        try {
            const start = message.indexOf('<updatedUsers>') + '<updatedUsers>'.length;
            const end = message.indexOf('</updatedUsers>');
            updatedUsers = JSON.parse(message.slice(start, end));
        } catch (err) {
            const start = message.indexOf('<updatedUsers>') + '<updatedUsers>'.length;
            const end = message.indexOf('</updatedUsers>');
            console.log('aaa', message.slice(start, end));
        }        
        const result = await updateUsers(updatedUsers);
        await handleAiAnswer({userId, message: String(result), conversationId, req, res})
    } 

    
}

const checkUpdateUser = async ( {userId, message, conversationId, req, res} ) => {

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

        let userData = {};
        try {
            userData = JSON.parse(answer.text);
        } catch (err) {
            console.log(answer.text);
        }

        const updatedUser = userData && await updateUser( userId, userData, req, res );

        console.log(updatedUser);

}

const checkBookingRoom = async ( {userId, message, conversationId, req, res} ) => {

    const allRooms = await Room.find();

    const newChat = await datacollectorAgent.getChat([
        {
            role: "user",
            parts: [{ text: promptForRoomsManagerAgent(allRooms) }],
        },
        {
            role: "model",
            parts: [{ text: "ok, i'm ready" }],
        },
    ]);

    const answer_ = await newChat.sendMessage({
        message: message.slice(message.indexOf('<mfrb>') + '<mfrb>'.length, message.indexOf('</mfrb>')),
    });

    const answer = answer_.text;

    const messageForReceptionistAgent = answer.slice(answer.indexOf('<ms>'), answer.indexOf('</ms>'));
    let updatedRooms = [];
    
    try {
        const start = answer.indexOf('<updatedrooms>') + '<updatedrooms>'.length;
        const end = answer.indexOf('</updatedrooms>');
        updatedRooms = JSON.parse(answer.slice(start, end));
    } catch (err) {
        const start = answer.indexOf('<updatedrooms>') + '<updatedrooms>'.length;
        const end = answer.indexOf('</updatedrooms>');
        console.log('aaa', answer.slice(start, end));
    }

    console.log('updatedRoom : ' + updatedRooms);
    
    if (Array.isArray(updatedRooms) && updatedRooms.length > 0) {
        await Promise.all(
            updatedRooms.map(room =>
                Room.findOneAndUpdate({ _id: room._id }, { ...room })
            )
        );
    }
    
    console.log(answer.text);
    await checkSymbols({userId, message: messageForReceptionistAgent, conversationId, req, res})
    await handleAiAnswer( {userId, message: messageForReceptionistAgent, conversationId, req, res} );
    

}