import {main} from "@/config/openRouter";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { prompt } = await req.json();
    // console.log(prompt);

    const content = await main(
      prompt +
        "You are a smart, helpful chatbot assistant designed to support users with clear, accurate, and practical answers",
    );

    return NextResponse.json({ content: content, success: true });
  } catch (error) {
    return NextResponse.json({
      message: error.message || error,
      success: false,
    });
  }
}
