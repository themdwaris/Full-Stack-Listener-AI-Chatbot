import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/config/db";
import UserModel from "@/model/userModel";

export async function GET(req) {
  try {
    // Get token from cookies
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ success: false, user: null });
    }

    //Verifying token
    const decodeUser = await jwt.verify(token, process.env.JWT_SECRET);

    await dbConnect();

    const user = await UserModel.findById(decodeUser?.userId).select(
      "-password",
    );

    if (!user) return NextResponse.json({ success: false, user: null });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    return NextResponse.json({ success: false, user: null });
  }
}
