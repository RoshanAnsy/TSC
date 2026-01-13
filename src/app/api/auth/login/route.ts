import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
// import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Handle CORS preflight requests
export async function OPTIONS(req: Request) {
  const origin = req.headers.get("origin");
  
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": origin || "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Credentials": "true",
    },
  });
}

export async function POST(req: Request) {
  // const origin = req.headers.get("origin");
  const origin=process.env.NEXT_PUBLIC_APP_URL;
  
  
  try {
  console.log("request is coming here")
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "Username and password required" },
        { status: 400 }
      );
    }
    console.log("admin call before")
    // ✅ Find Admin user
    const user = await prisma.admin.findUnique({
      where: { username },
    });
    console.log("admin call after",user)
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // ✅ Check password
    // const isValid = await bcrypt.compare(password, user.password);

    // if (!isValid) {
    //   return NextResponse.json(
    //     { success: false, message: "Invalid credentials" },
    //     { status: 401 }
    //   );
    // }

    // ✅ Create JWT token
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role, // ENUM value from Prisma
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });

    // ✅ Set cookie
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    // Add CORS headers
    response.headers.set("Access-Control-Allow-Origin", origin || "*");
    response.headers.set("Access-Control-Allow-Credentials", "true");

    console.log("This is response from backend",response)

    return response;
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    const errorResponse = NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
    
    // Add CORS headers to error response
    errorResponse.headers.set("Access-Control-Allow-Origin", origin || "*");
    errorResponse.headers.set("Access-Control-Allow-Credentials", "true");

    return errorResponse;
  }
}
catch (error) {
  console.error("UNEXPECTED ERROR:", error);
  return NextResponse.json(
    { success: false, message: "Unexpected server error" },
    { status: 500 }
  );
}
}