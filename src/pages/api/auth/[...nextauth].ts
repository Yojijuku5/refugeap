import NextAuth, { type NextAuthOptions } from "next-auth";
// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db";
import { sendVerificationRequest } from "../../../utils/email";

export const authOptions: NextAuthOptions = {
  // Include user.id and isAdmin on session
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.isAdmin = user.isAdmin;
      }
      return session;
    },
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOODLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    EmailProvider({
      server: {
        host: env.EMAIL_SERVER_HOST,
        port: env.EMAIL_SERVER_PORT,
        auth: {
          user: env.EMAIL_SERVER_USER,
          pass: env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: env.EMAIL_FROM,
      sendVerificationRequest,
    }),
  ],
  secret: env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/sign-in",
    verifyRequest: "/verify-request",
    signOut: "/sign-out",
  },
};

export default NextAuth(authOptions);
