import { NextResponse } from "next/server";
import dbConnect from "@/config/db";
import UserModel from "@/model/userModel";
import bcrypt from "bcrypt";
import jwt  from "jsonwebtoken";

export async function POST(req) {
  try {
    await dbConnect();

    const { name, email, password } = await req.json();

    //Checking user already exist or not
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exist", success: false },
        { status: 400 },
      );
    }

    // Encrypt password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Creating new user
    const user = await UserModel.create({
      name,
      email,
      password: hashedPassword,
    });

    //Creating token
    const token = await jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const response = NextResponse.json({
      message: "Registration successful",
      success: true,
      user: { name: user?.name, email: user?.email },
    });

    // Setting up cookies
    response.cookies.set("token",token,{
      httpOnly:true,
      secure:process.env.NODE_ENV==='production',
      sameSite:'strict',
      maxAge:7*24*60*60,
      path:"/"
    })

    return response

  } catch (error) {
    console.log("Failed to register::", error);
    return NextResponse.json({
      message: error?.message || error,
      success: false,
    });
  }
}
