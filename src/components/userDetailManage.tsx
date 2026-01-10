import { cookies } from "next/headers";
import { jwtVerify, JWTPayload } from "jose";

interface UserPayload extends JWTPayload {
  id: string;
  username: string;
  email?: string;
  role: string;
}

export async function userDetailManage() {
  const token = cookies().get("auth_token")?.value;
  if (!token) return null;

  const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

  try {
    const { payload } = await jwtVerify(token, secret) as { payload: UserPayload };

    return {
      id: payload.id,
      username: payload.username,
      email: payload.email,
      role: payload.role.toLowerCase(),
    };
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}
