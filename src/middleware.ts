// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
// import { routeAccessMap } from "./lib/settings";
// import { NextResponse } from "next/server";

// const matchers = Object.keys(routeAccessMap).map((route) => ({
//   matcher: createRouteMatcher([route]),
//   allowedRoles: routeAccessMap[route],
// }));

// console.log(matchers);

// export default clerkMiddleware((auth, req) => {
//   // if (isProtectedRoute(req)) auth().protect()

//   const { sessionClaims } = auth();

//   const role = (sessionClaims?.metadata as { role?: string })?.role;

//   for (const { matcher, allowedRoles } of matchers) {
//     if (matcher(req) && !allowedRoles.includes(role!)) {
//       return NextResponse.redirect(new URL(`/${role}`, req.url));
//     }
//   }
// });

// export const config = {
//   matcher: [
//     // Skip Next.js internals and all static files, unless found in search params
//     "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
//     // Always run for API routes
//     "/(api|trpc)(.*)",
//   ],
// };




// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import jwt from "jsonwebtoken";
// // import jwt from "jsonwebtoken";

// import { routeAccessMap } from "./lib/settings";

// export function middleware(req: NextRequest) {
//   console.log("this is coming here")
//   const token = req.cookies.get("auth_token")?.value;

//   console.log("token is here",token)
//   // 🔐 Not logged in → go to sign-in
//   if (!token) {
//     return NextResponse.redirect(new URL("/sign-in", req.url));
//   }

//   try {
//     console.log(process.env.JWT_SECRET)
//     if (!process.env.JWT_SECRET) {
//       throw new Error("JWT_SECRET missing");
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
//       role: string;
//     };

//     const role = decoded.role.toLowerCase();
//     const pathname = req.nextUrl.pathname;
//     console.log("thi is role path",role)
//     // 🛡 Role-based route protection
//     for (const route in routeAccessMap) {
//       const regex = new RegExp(`^${route}`);
//       if (regex.test(pathname)) {
//         if (!routeAccessMap[route].includes(role.toUpperCase())) {
//           return NextResponse.redirect(new URL(`/${role}`, req.url));
//         }
//       }
//     }

//     return NextResponse.next();
//   } catch (err) {
//     // ❌ Invalid or expired token
//     return NextResponse.redirect(new URL("/sign-in", req.url));
//   }
// }

// export const config = {
//   matcher: [
//     "/admin/:path*",
//     "/student/:path*",
//     "/teacher/:path*",
//     "/parent/:path*",
//   ],
// };





// import { NextResponse } from "next/server";
// import jwt from "jsonwebtoken";
// import { routeAccessMap } from "./lib/settings";
// import type { NextRequest } from "next/server";

// export function middleware(req: NextRequest) {
//   const { pathname } = req.nextUrl;

//   // ✅ 1. Skip API routes
//   if (pathname.startsWith("/api")) {
//     return NextResponse.next();
//   }

//   // ✅ 2. Allow login page
//   if (pathname === "/login") {
//     return NextResponse.next();
//   }

//   const token = req.cookies.get("auth_token")?.value;

//   if (!token) {
//     return NextResponse.redirect(new URL("/login", req.url));
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
//     const role = decoded.role;
//     console.log("this is role comes from middleware",role);

//     for (const route in routeAccessMap) {
//       const regex = new RegExp(route);
//       if (regex.test(pathname)) {
//         if (!routeAccessMap[route].includes(role)) {
//           return NextResponse.redirect(new URL(`/${role}`, req.url));
//         }
//       }
//     }

//     return NextResponse.next();
//   } catch {
//     return NextResponse.redirect(new URL("/login", req.url));
//   }
// }

// export const config = {
//   matcher: [
//     "/((?!api|_next|login|favicon.ico).*)",
//   ],
// };



import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import { routeAccessMap } from "./lib/settings";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(req: any) {
  const token = req.cookies.get("auth_token")?.value;
  const pathname = req.nextUrl.pathname;

  // If user hits public routes, allow
  const publicRoutes = ["/sign-in", "/sign-up"];
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // If no token, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    const role = (payload.role as string).toLowerCase();

    // If signed in and lands on "/", send to role dashboard
    if (pathname === "/") {
      return NextResponse.redirect(new URL(`/${role}`, req.url));
    }

    // Validate route access
    for (const route in routeAccessMap) {
      const regex = new RegExp(route);
      if (regex.test(pathname)) {
        if (!routeAccessMap[route].includes(role)) {
          return NextResponse.redirect(new URL(`/${role}`, req.url));
        }
      }
    }

    return NextResponse.next();
  } catch (err) {
    console.error("JWT VERIFY FAILED", err);
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }
}

export const config = {
  matcher: [
    "/",                      // protect home
    "/admin/:path*", 
    "/student/:path*", 
    "/teacher/:path*", 
    "/parent/:path*",
  ],
};
