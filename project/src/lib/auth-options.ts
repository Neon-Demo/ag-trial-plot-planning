import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { DEMO_USERS } from "./demo-data";
import { UserRole } from "@prisma/client";

export const authOptions: NextAuthOptions = {
  providers: [
    // Demo credentials provider
    CredentialsProvider({
      id: "credentials",
      name: "Demo Login",
      credentials: {
        username: { label: "Username", type: "text" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.username) {
            return null;
          }

          // Find the user in our demo data
          const username = credentials.username;
          console.log("Looking for demo user:", username);
          const user = DEMO_USERS.find(
            (user) => user.email.split("@")[0] === username
          );

          if (!user) {
            return null;
          }

          // Convert string role to UserRole enum
          const userRole = user.role as UserRole;
          
          // Return the user object with properly typed role
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: userRole,
            image: user.image,
            organizationId: user.organizationId
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      }
    })
  ],
  
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
    // Explicitly set these to avoid NextAuth defaults
    signOut: "/auth/signin"
  },
  
  // Disable JWT encryption to avoid decryption issues
  jwt: {
    // Using a very long maxAge to ensure the token doesn't expire in development
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },
  
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },
  
  callbacks: {
    async jwt({ token, user }) {
      // Copy user properties to the token
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.organizationId = user.organizationId;
      }
      return token;
    },
    
    async session({ session, token }) {
      // Copy token properties to the session
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
        session.user.organizationId = token.organizationId as string;
      }
      return session;
    }
  },
  
  secret: "DontUseThisValueInProduction",
  debug: true
};