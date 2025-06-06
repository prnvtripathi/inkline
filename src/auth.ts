import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import NextAuth, { DefaultSession, User as NextAuthUser } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import "next-auth/jwt";

interface ExtendedUser extends NextAuthUser {
  id: string;
  image: string;
  password: string;
}

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      image: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    image?: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  trustHost: true,
  providers: [
    GitHub,
    Google,
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        try {
          const user = await login(credentials as LoginCredentials);
          if (user) {
            return user as ExtendedUser; // Ensure we return ExtendedUser
          }
          return null;
        } catch (error) {
          if (error instanceof Error) {
            // console.log("Authentication error:", error.message);
          } else {
            // console.log("Unexpected error:", error);
          }
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user && typeof (user as ExtendedUser).id === "string") {
        token.id = (user as ExtendedUser).id;
        token.image = (user as ExtendedUser).image;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id || "";
        session.user.image = token.image || "";
      }
      return session;
    },
  },
});

// Define LoginCredentials for typing

interface LoginCredentials {
  email: string;
  password: string;
}

interface ExtendedUser {
  id: string;
  name: string | null;
  email: string;
  image: string;
  password: string;
}

export async function login(
  credentials: LoginCredentials
): Promise<ExtendedUser | null> {
  const { email, password } = credentials;

  // 1. Find user by email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !user.password) {
    return null; // User not found or missing password
  }

  // 2. Compare passwords
  const isValid = await compare(password, user.password);
  if (!isValid) {
    return null;
  }

  // 3. Return ExtendedUser shape
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image ?? "",
    password: user.password, // only for internal use
  };
}
