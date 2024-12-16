import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
// import {Configuration, OpenAIApi} from "openai";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {increaseApiLimit, checkApiLimit} from "@/lib/api-limit";

// const configuration=new Configuration({
//     apikey: process.env.OPENAI_API_KEY,

// });

// Initialize Google Gemini API
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || "");

// const instructionMessage:
const instructionMessage = {
  role: "system",
  content: "You are a highly advanced code generator. Respond to user queries by generating code snippets and explanations as requested. You must answer only in markdown code snippets and then give explanation too. Use code comments for explanations. "
};

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { messages } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      return new NextResponse("Google Gemini API Key not configured", { status: 500 });
    }

    if (!messages) {
      return new NextResponse("Messages are required", { status: 400 });
    }

    const freeTrial = await checkApiLimit();

    if (!freeTrial){
      return new NextResponse("Free trail has expired", {status:403} );
    }

     // Add the instructionMessage to the conversation
     const fullConversation = [
      instructionMessage,
      ...messages // Append user messages to the conversation
    ];

    // Extract the last message's content (assuming this is the prompt)
    const prompt = fullConversation.map((msg) => `${msg.role}: ${msg.content}`).join("\n");

    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }

    try {
        
      const model = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const response = await model.generateContent(prompt);
      console.log(response);

      // Prepare the AI response
      const aiMessage = {
        role: "assistant",
        content: response.response.text(),
      };
      console.log("5");
      console.log(aiMessage);

      await increaseApiLimit();

      return NextResponse.json(aiMessage);

    } catch (error) {
      console.error("Google Gemini API Error:", error);
      return new NextResponse("Error generating content", { status: 500 });
    }
  } catch (error) {
    console.error("[CODE_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}






// open ai

// const openai= new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY, 
//   });
// export async function POST(
//     req: Request
// ){
//     try{

    
//         const { userId } = await auth();
//         const body = await req.json();
//         const {messages} = body;

//         if (!userId){
//             return new NextResponse("Unauthorized", {status: 401});
//         }

//         if (!process.env.OPENAI_API_KEY){
//             return new NextResponse("OpenAI API Key not configured", {status: 500});
//         }

//         if (!messages){
//             return new NextResponse("Messages are required", {status: 400});
//         }

//         const response = await openai.chat.completions.create({
//             model: "gpt-3.5-turbo",
//             max_tokens: 5,
//             messages,
//         });

//         return NextResponse.json(response.choices[0].message);
//     } catch (error) {


//         console.log("[CONVERSATION_ERROR]", error);
//         return new NextResponse("Internal error", {status: 500});

//     }
// }