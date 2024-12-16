import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
// import {Configuration, OpenAIApi} from "openai";
// import { GoogleGenerativeAI } from "@google/generative-ai";
import Replicate from "replicate";
import { writeFile } from "node:fs/promises";

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

  //   const input = {
  //     prompt: "A close-up of a woman's dress fabric fluttering in the gentle ocean breeze, shimmering in the sunlight. Soft, natural light reflecting off the fabric"
  // };
  
  // const response = await replicate.run("haiper-ai/haiper-video-2", { input });
  
  
  // await writeFile("output.mp4", response);
  // console.log(response)
  // return NextResponse.json(response)

    
  } catch (error) {
    console.error("[VIDEO_ERROR]", error);
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