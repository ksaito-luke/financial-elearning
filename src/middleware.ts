import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest } from "next/server";

// Edge-compatible auth (no DB, JWT only)
const { auth } = NextAuth(authConfig);

const intlMiddleware = createMiddleware(routing);

const protectedPaths = ["/dashboard", "/quiz", "/admin"];

export default auth((req: NextRequest & { auth?: unknown }) => {
  const { pathname } = req.nextUrl;

  const pathWithoutLocale = pathname.replace(/^\/(en|ja)/, "") || "/";
  const isProtected = protectedPaths.some((p) =>
    pathWithoutLocale.startsWith(p)
  );

  if (isProtected && !(req as { auth?: unknown }).auth) {
    const locale = pathname.split("/")[1] || "en";
    const validLocale = ["en", "ja"].includes(locale) ? locale : "en";
    return Response.redirect(new URL(`/${validLocale}/login`, req.url));
  }

  return intlMiddleware(req);
});

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
