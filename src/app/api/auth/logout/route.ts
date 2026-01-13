import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  // Remove auth_token cookie on server
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");

  return NextResponse.json({
    success: true,
    message: "Logged out successfully",
  });
}