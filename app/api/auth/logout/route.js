import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({
    message: "Logout successful",
    success: true,
  });

  // Deleting cookies
  response.cookies.set("token", "", { maxAge: 0 });
  return response;
}
