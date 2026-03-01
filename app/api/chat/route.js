import dbConnect from "@/config/db";
import ChatModel from "@/model/chatModel";
import { NextResponse } from "next/server";

// Rename chat history

export async function PATCH(req) {
    await dbConnect();
  try {
    const { chatId, title } = await req?.json();
    
    const chat = await ChatModel.findById(chatId);
    
    if (!chat)
      return NextResponse.json({ message: "Chat not found", success: false });

    await ChatModel.findByIdAndUpdate(chatId, { title: title });
    return NextResponse.json({ message: "Rename successful", success: true });
  } catch (error) {
    console.log("Failed to rename chat::", error);
    return NextResponse.json({
      message: error?.message || error,
      success: false,
    });
  }
}

// Delete chat history

export async function DELETE(req) {
  await dbConnect();
  try {
    const { chatId } = await req?.json();
    const chat = await ChatModel.findByIdAndDelete(chatId);
    if (!chat)
      return NextResponse.json({ message: "Chat not found", success: false });

    return NextResponse.json({ message: "Deletion successful", success: true });
  } catch (error) {
    console.log("Failed to delete chat::", error);
    return NextResponse.json({
      message: error?.message || error,
      success: false,
    });
  }
}
