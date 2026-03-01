import { NextResponse } from "next/server";
import dbConnect from "@/config/db";
import UserModel from "@/model/userModel";
import bcrypt from 'bcrypt';
import jwt  from "jsonwebtoken";

export async function POST(req) {
  try {
    await dbConnect();

    const { email, password } = await req.json();

    //Checking user already exist or not
    const user = await UserModel.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials", success: false },
        { status: 401 },
      );
    }

    // Checking password
    const isMatch = await bcrypt.compare(password, user?.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Wrong password", success: false },
        { status: 401 },
      );
    }

    //Creating token
    const token = await jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const response = NextResponse.json({
      message: "Login successful",
      success: true,
      user: { name: user?.name, email: user?.email },
    });

    // Setting up cookies
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.log("Failed to login::", error);
    return NextResponse.json({
      message: error?.message || error,
      success: false,
    });
  }
}
