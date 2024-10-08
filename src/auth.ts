import NextAuth, { User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { NextResponse } from "next/server";
import { authenticateUser } from "@/services/authService";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        identifier: { label: "Username" },
        password: { label: "Password", type: "Password" },
      },
      authorize: async (
        credentials: Partial<Record<"identifier" | "password", unknown>>,
      ): Promise<User> => {
        try {
          return await authenticateUser({
            identifier: credentials.identifier as string,
            password: credentials.password as string,
          });
        } catch (error) {
          throw new Error("Something went wrong!");
        }
      },
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token._id = user._id as string;
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username;
      }

      return token;
    },
    session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isAcceptingMessages;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.username = token.username;
      }

      return session;
    },
    authorized({ request: { nextUrl }, auth }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;
      // If user already logged in then redirect to home page
      if (pathname.startsWith("/signin") && isLoggedIn) {
        return NextResponse.redirect(new URL("/", nextUrl));
      }
      // In order to access API publicly
      if (pathname.startsWith("/api")) {
        return true;
      }

      return !!auth;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
});
