import { NextResponse } from "next/server";
import { verifyToken } from "./lib/utils";

export const config = {
  matcher: '/',
};

export async function middleware(req, ev) {

  const token = req ? req.cookies.get("token")?.value : null;
  const userId = await verifyToken(token);
  const { pathname } = req.nextUrl;

  /*console.log("userId", userId)
  console.log("tokenMiddleware", token)
  console.log("pathname", pathname)*/

  if((token && userId) || pathname.includes("api/login")){
    return NextResponse.next();
  }

  /*if (
    pathname.startsWith("/_next") ||
    pathname.includes("/api/login") ||
    userId ||
    pathname.includes("/static")
  ) {
    return NextResponse.next();
  }*/

  if ((!token || !userId) && pathname !== "/login") {
    
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.rewrite(url);
  }
}

