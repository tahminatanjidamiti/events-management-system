import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import { ILocation, Role, UserStatus } from "@/types";


declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      fullName?: string | null;
      email?: string | null;
      role?: Role | null;
      picture?: string | null;
      phone?: string | null;
      status?: UserStatus | null;
      isVerified?: boolean | null;
      bio?: string | null;
      interests: string[] | null;
      city?: ILocation | null;
      avgRating: number | null;
      reviewCount: number | null;
    };
  }
  interface User {
    id: string;
    fullName?: string | null;
    email?: string | null;
    role?: Role | null;
    picture?: string | null;
    phone?: string | null;
    status?: UserStatus | null;
    isVerified?: boolean | null;
    bio?: string | null;
    interests: string[] | null;
    city?: ILocation | null;
    avgRating: number | null;
    reviewCount: number | null;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Email or password is missing");
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_API}/auth/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          }
        );

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Invalid credentials");
        }

        const response = await res.json();
        const user = response?.data?.result;

        if (!user?.id) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          picture: user.picture,
          phone: user.phone,
          status: user.status,
          isVerified: user.isVerified,
          bio: user.bio,
          interests: user.interests,
          city: user.city,
          avgRating: user.avgRating,
          reviewCount: user.reviewCount,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user?.id;
        token.fullName = user?.fullName;
        token.role = user?.role;
        token.picture = user?.picture;
        token.status = user?.status;
        token.phone = user?.phone;
        token.isVerified = user?.isVerified;
        token.bio = user?.bio;
        token.interests = user?.interests;
        token.city = user?.city;
        token.avgRating = user?.avgRating;
        token.reviewCount = user?.reviewCount;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token?.id as string;
        session.user.fullName = token?.fullName as string;
        session.user.role = token?.role as Role;
        session.user.picture = token?.picture as string;
        session.user.status = token?.status as UserStatus;
        session.user.phone = token?.phone as string;
        session.user.isVerified = token?.isVerified as boolean;
        session.user.bio = token?.bio as string; session.user.interests = token?.interests as string[];
        session.user.city = token?.city as ILocation;
        session.user.avgRating = token?.avgRating as number;
        session.user.reviewCount = token?.reviewCount as number;
      }
      return session;
    },
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_API}/auth/google`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              fullName: user.name,
              email: user.email,
              picture: user.image,
            }),
          }
        );

        const response = await res.json();

        if (!res.ok || !response.success) {
          return false;
        }

        const dbUser = response.data;

        user.id = dbUser.id;
        user.fullName = dbUser.fullName;
        user.role = dbUser.role;
        user.picture = dbUser.picture;
        user.phone = dbUser.phone;
        user.status = dbUser.status;
        user.isVerified = dbUser.isVerified;
        user.bio = dbUser.bio;
        user.interests = dbUser.interests;
        user.city = dbUser.city;
        user.avgRating = dbUser.avgRating;
        user.reviewCount = dbUser.reviewCount;
      }

      return true;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
};