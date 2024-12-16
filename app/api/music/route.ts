import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
// import {Configuration, OpenAIApi} from "openai";
// import { GoogleGenerativeAI } from "@google/generative-ai";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN

});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { prompt } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

  
    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }

    const input = {
      prompt_b: prompt
  };
  
  const response = await replicate.run("riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05", { input });
  console.log(response)
  return NextResponse.json(response)

    
    // const prompt = messages[messages.length - 1]?.content;

    // if (!prompt) {
    //   return new NextResponse("Prompt is required", { status: 400 });
    // }

    // try {
        
    //   const model = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    //   const response = await model.generateContent(prompt);
    //   console.log(response);

      
    //   const aiMessage = {
    //     role: "assistant",
    //     content: response.response.text(),
    //   };
    //   console.log("5");
    //   console.log(aiMessage);

      // return NextResponse.json(aiMessage);

    // } catch (error) {
    //   console.error("Google Gemini API Error:", error);
    //   return new NextResponse("Error generating content", { status: 500 });
    // }
  } catch (error) {
    console.error("[MUSIC_ERROR]", error);
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