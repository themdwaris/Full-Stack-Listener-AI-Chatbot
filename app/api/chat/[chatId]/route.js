import dbConnect from "@/config/db";
import { main } from "@/config/openRouter";
import ChatModel from "@/model/chatModel";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

// export async function POST(req, { params }) {
//   try {
//     const token = req.cookies.get("token")?.value;
//     if (!token)
//       return NextResponse.json(
//         { success: false, message: "Unauthorized" },
//         { status: 401 },
//       );

//     const decodeUser = await jwt.verify(token, process.env.JWT_SECRET);
//     const { chatId } = await params;
//     const { prompt } = await req?.json();

//     await dbConnect();

//     const chat = await ChatModel.findOne({
//       _id: chatId,
//       userId: decodeUser?.userId,
//     });
//     if (!chat)
//       return NextResponse.json(
//         { success: false, message: "Chat not found" },
//         { status: 404 },
//       );

//     //Ai response
//     const aiResponse = await main(prompt);

//     //Pushing message
//     chat.messages.push({ role: "user", text: prompt });
//     chat.messages.push({ role: "ai", text: aiResponse });
//     await chat.save();

//     return NextResponse.json({
//       success: true,
//       aiResponse,
//     });
//   } catch (error) {
//     console.log("Failed to get response:", error);
//     return NextResponse.json(
//       { success: false, message: "Failed to give response" },
//       { status: 500 },
//     );
//   }
// }

export async function POST(req, { params }) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );

    const decodeUser = jwt.verify(token, process.env.JWT_SECRET);
    const { chatId } = await params;
    const { prompt } = await req.json();

    await dbConnect();

    const chat = await ChatModel.findOne({
      _id: chatId,
      userId: decodeUser?.userId,
    });
    if (!chat)
      return NextResponse.json(
        { success: false, message: "Chat not found" },
        { status: 404 },
      );

    // Stream response banao
    const encoder = new TextEncoder();
    let fullResponse = "";

    const stream = new ReadableStream({
      async start(controller) {
        await main(prompt, (token) => {
          fullResponse += token;
          // Har token client ko bhejo
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ token })}\n\n`),
          );
        });

        // DB mein save karo jab complete ho
        chat.messages.push({ role: "user", text: prompt });
        chat.messages.push({ role: "ai", text: fullResponse });
        await chat.save();

        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.log("Failed to get response:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}

// Fetching Chat history thread
export async function GET(req, { params }) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );

    const decodeUser = jwt.verify(token, process.env.JWT_SECRET);
    const { chatId } = await params;

    await dbConnect();

    const chat = await ChatModel.findOne({
      _id: chatId,
      userId: decodeUser.userId,
    });
    if (!chat)
      return NextResponse.json(
        { success: false, message: "Chat not found" },
        { status: 404 },
      );

    return NextResponse.json({
      success: true,
      messages: chat.messages,
      title: chat.title,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}

// Save generated image

export async function PATCH(req, { params }) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );

    const decodeUser = jwt.verify(token, process.env.JWT_SECRET);
    const { chatId } = await params;
    const { prompt, imageUrl } = await req.json();

    await dbConnect();

    const chat = await ChatModel.findOne({
      _id: chatId,
      userId: decodeUser?.userId,
    });
    if (!chat)
      return NextResponse.json(
        { success: false, message: "Chat not found" },
        { status: 404 },
      );

    if (prompt && prompt.trim()) {
      chat.messages.push({ role: "user", text: prompt });
    }

    // ✅ Image ke sath prompt bhi save karo
    chat.messages.push({
      role: "ai",
      text: "",
      image: imageUrl,
      // imagePrompt: imagePrompt, // ✅
    });
    await chat.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PATCH error:", error.message); // ✅ add karo
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
