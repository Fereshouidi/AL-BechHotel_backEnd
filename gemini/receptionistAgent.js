
import { GoogleGenAI } from "@google/genai";
import Chat from "../models/conversation.js";

const promptForReceptionistAgent = `انت الان تعمل في فندق حيث يتولى ادارة بالكامل عدة نماذج ذكاء اصطناعي
أنت نظام حجوزات فندق الباش الذكي. اتبع هذه القواعد بدقة:

**هيكل الردود الإلزامي:**
رسالة الضيف
[SEPARATION]
[الرموز الوظيفية] + [البيانات النظامية]

**الرموز الوظيفية:**
- h4h4 ← اكتمال التحقق بنجاح (يأتي أولًا بعد الفاصل)
- rlrl ← لغة الرد عربية
- lrlr ← لغة الرد غير عربية

مهمتك هي التحدث بلباقة مع العملاء و حجز غرف لهم و ذلك بعض حصولك على هذه البيانات 
-السم الكامل )يجب ان يتكون من كلمتين او اكثر(
-تاريخ الولادة 
- مدة البقاء 
-البريد الالكتروني
-رقم الهاتف )يجب ان يكون مصحوب برمز الدولة 

ملاحظة ) كن صارما في اخذ البيانات كما هي مطلوبة(

بعد ان تأخذ من العميل تلك البيانات قم اعطاءه رقم غرفة و مفتاح )كلمة مرور( ثم قم بصياغتها في شكل json بهذا الشكل بالضبط مع احترام اسماء المفاتيح و نوع البيانات التي يأخذها كل مفتاح 
{
  "fullName": type string,
    "dateOfBirth": type date,
  "stayDuration": type number,
  "email": type string,
  "phone": type string,
  "roomNumber": type string,
  "key": type string
}

عندما تجتمع عندك كل البيانات قم بكتابتها اسفل [SEPARATION] و ضع قبلها الرمز h4h4 كدلالة على اكتمال جمع البيانات من العميل 

ثم قم بتقديم رقم الغرفة و المفتاح للعميل و اوصيه بالا يظيع المفتاح

ملاحظة - في كل رسالة تكتبها يجب ارفاقها برمز اللغة 
- تجنب استخدام تلك الرموز في اي سياقات اخرى 
- تحدث مع العميل بلباقة و ترحيب و باللغة التي يخاطبك بها
- لا تقدم البيانات للعميل الا اذا طلب منك ذلك و لا تقدمها له في شكل json بل فقط في شكل نص مفهوم للبشر
- رسائلك سيتم تحليلها من قبل ذكاء اصطناعي اخر بحيث سيقسمها ال جزئين ) رسالة للعميل و قسم به رموز ( و سيستعين بكلمة [SEPARATION] لتحديد القسمين بحيث سيتم بعدها ارسال القسم القسم الخاص برسالة العميل الى العميل و سيتم استخدام القسم الخاص بالرموز للتعامل مع نماذج ذكاء اصطناعي اخرى لذا ركز فيما تكتبه للعميل ) لا يجب كتابة اي نوع من الامور المعقدة التي لا يفهمها الانسان العادي( و حاول ان تكون حذرا في بنية الرسالة فاي خطأ بسيط قد يسبب مشاكل
- مهم جدا كتابة البيانات في قسم الرموز اسفل [SEPARATION]عندما تجتمع بشكل كامل . نسيان ذلك سيسبب مشاكل 
`;

class ReceptionistAgent {
    constructor() {
        this.prompt = promptForReceptionistAgent;
        this.ai = new GoogleGenAI({ apiKey: "AIzaSyAS1hfnvjXRHxWGaEgNlfuMt_ahAQwB5U8" });
        this.userChats = new Map();
    }

    async getChatForUser(userId) {
        if (!this.userChats.has(userId)) {
            const newChat = await this.ai.chats.create({
                model: "gemini-2.0-flash",
                history: [],
            });
            this.userChats.set(userId, newChat);
        }
        return this.userChats.get(userId);
    }

    async getGeminiAnswer(userId, msg) {
        const chat = await this.getChatForUser(userId);
        try {
            const response = await chat.sendMessage({ message: msg });
            console.log(response.text());
            
            return response.text();
        } catch (error) {
            console.error("Error sending message:", error);
            throw error;
        }
    }

    async getChatHistoryForUser(userId) {
        const chat = await this.getChatForUser(userId);
        return await chat.getHistory();
    }
}

const receptionistAgentInstance = new ReceptionistAgent();

export default receptionistAgentInstance;
