
import { GoogleGenAI } from "@google/genai";
import Chat from "../models/conversation.js";

export class Gemini {

  constructor () {
    this.ai = new GoogleGenAI({ apiKey: "AIzaSyDjLld0ynrVEvbIFK3inQCp4tR3UEScaxs" });
    this.user = null;
    this.chat = null;
    this.chats = [];
  }

  async getChat(history) {
      return this.ai.chats.create({
          model: "gemini-2.0-flash",
          history: history,
        });
  }

}


export default Gemini;
