import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import MicrosoftProvider from "next-auth/providers/azure-ad";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    MicrosoftProvider({
      clientId: process.env.MICROSOFT_CLIENT_ID || "",
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET || "",
      tenantId: process.env.MICROSOFT_TENANT_ID,
    }),
    // Demo login provider - only for development
    CredentialsProvider({
      name: "Demo Account",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "demo" },
        role: { label: "Role", type: "select", options: ["admin", "researcher", "field-technician"] }
      },
      async authorize(credentials) {
        // Only allow in development or if demo mode is explicitly enabled
        if (process.env.NODE_ENV !== "development" && process.env.ALLOW_DEMO_LOGIN !== "true") {
          return null;
        }

        // Return demo user based on selected role
        const role = credentials?.role || "researcher";
        
        const users = {
          admin: {
            id: "demo-admin",
            name: "Demo Admin",
            email: "admin@example.com",
            image: null,
            role: "admin",
          },
          researcher: {
            id: "demo-researcher",
            name: "Demo Researcher",
            email: "researcher@example.com",
            image: null,
            role: "researcher",
          },
          "field-technician": {
            id: "demo-field-tech",
            name: "Demo Field Technician",
            email: "field-tech@example.com",
            image: null,
            role: "field-technician",
          },
        };
        
        return users[role as keyof typeof users];
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        return {
          ...token,
          userId: user.id,
          role: (user as any).role || "user",
          accessToken: account.access_token,
        };
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.userId;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};