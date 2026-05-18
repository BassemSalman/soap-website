import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe NextAuth config — no Node.js-only imports.
 * Used by middleware.ts. Providers are added in auth.ts for the full config.
 */
export const authConfig = {
  pages: {
    signIn: "/auth/sign-in",
    verifyRequest: "/auth/verify-request",
    error: "/auth/error",
  },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdmin = (auth?.user as { role?: string } | undefined)?.role === "ADMIN";
      const { pathname } = nextUrl;

      if (pathname.startsWith("/admin")) {
        return isAdmin;
      }
      if (pathname.startsWith("/account") || pathname.startsWith("/checkout")) {
        return isLoggedIn;
      }
      return true;
    },
  },
} satisfies NextAuthConfig;
