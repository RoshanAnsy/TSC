import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
// import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
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

    console.log("This is response from backend",response)

    return response;
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
