import prisma from "@/lib/prisma";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcrypt";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email },
        });
        if (!user || !user.password) return null;
        const isValid = await bcrypt.compare(
          credentials?.password || "",
          user.password
        );
        if (!isValid) return null;
        return {
          id: user.id,
          email: user.email,
          name: user.name ?? "",
          image: user.image ?? "",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: { signIn: "/auth/signin" },
  secret: process.env.NEXTAUTH_SECRET,
};
