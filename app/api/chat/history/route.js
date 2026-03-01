
import dbConnect from "@/config/db";
import ChatModel from "@/model/chatModel";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

//Fetching chat history

export async function GET(req) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      await dbConnect()

      const chats = await ChatModel.find({userId:decoded?.userId}).select('_id title createdAt').sort({createdAt:-1})

      return NextResponse.json({chats,success:true})

  } catch (error) {
    console.log("Failed to fetch chat history:", error);
    return NextResponse.json(
      { success: false, message: "Failed to give response" },
      { status: 500 },
    );
  }
}