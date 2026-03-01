import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/config/db";
import { main } from "@/config/openRouter";
import ChatModel from "@/model/chatModel";

export async function POST(req) {
  try {
    // Verify token from cookies
    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json({ message: "Unauthorized", success: false });

    // Decode user info from token
    const decodeUser = await jwt.verify(token, process.env.JWT_SECRET);

    await dbConnect();

    const { prompt } = await req.json();

    // Calling main Fun to get Ai response
    const aiResponse = await main(prompt);

    //Creating new chat

    const chat = await ChatModel.create({
      userId: decodeUser?.userId,
      title: prompt?.slice(0, 25),
      messages: [
        { role: "user", text: prompt },
        { role: "ai", text: aiResponse },
      ],
    });

    return NextResponse.json({
      success: true,
      chatId: chat?._id,
      title: chat?.title,
      messages: chat?.messages,
    });
  } catch (error) {
    console.log("Failed to get response:", error);
    return NextResponse.json(
      { success: false, message: "Failed to give response" },
      { status: 500 },
    );
  }
}
