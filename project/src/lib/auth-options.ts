import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import MicrosoftProvider from "next-auth/providers/azure-ad";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./db";

// Determine mode
const isDemoMode = process.env.ALLOW_DEMO_LOGIN === 'true' || process.env.NODE_ENV === 'development';
const hasDatabase = !!process.env.DATABASE_URL;

// Demo user database
const demoUsers = {
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

// Build auth config
const buildAuthConfig = (): NextAuthOptions => {
  // Start with provider array
  const providers = [];
  
  // Always add demo provider in demo mode
  if (isDemoMode) {
    providers.push(
      CredentialsProvider({
        name: "Demo Account",
        credentials: {
          username: { label: "Username", type: "text", placeholder: "demo" },
          role: { label: "Role", type: "select", options: ["admin", "researcher", "field-technician"] }
        },
        async authorize(credentials) {
          const role = credentials?.role || "researcher";
          return demoUsers[role as keyof typeof demoUsers];
        },
      })
    );
  }
  
  // Only add OAuth providers if we have a database
  if (hasDatabase) {
    if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
      providers.push(
        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })
      );
    }
    
    if (process.env.MICROSOFT_CLIENT_ID && process.env.MICROSOFT_CLIENT_SECRET) {
      providers.push(
        MicrosoftProvider({
          clientId: process.env.MICROSOFT_CLIENT_ID,
          clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
          tenantId: process.env.MICROSOFT_TENANT_ID,
        })
      );
    }
  }
  
  // Base auth config
  const config: NextAuthOptions = {
    providers,
    pages: {
      signIn: "/auth/signin",
      error: "/auth/error",
    },
    callbacks: {
      async jwt({ token, user, account }) {
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
    secret: process.env.NEXTAUTH_SECRET || 
      (process.env.NODE_ENV === "production" 
        ? undefined 
        : "DEVELOPMENT_SECRET_DO_NOT_USE_IN_PRODUCTION"),
    debug: process.env.NODE_ENV === "development" || process.env.DEBUG_AUTH === "true",
  };
  
  // Only try to add adapter in non-demo mode with a real database
  if (hasDatabase && !isDemoMode) {
    // Use a dynamic import pattern that won't affect the build
    // This code will only run at runtime on the server
    if (typeof window === 'undefined') {
      try {
        // Get a reference to the module name as a string to avoid
        // it being statically analyzed during build
        const adapterModule = '@' + 'auth/prisma-adapter';
        
        // Use an indirect dynamic require to fool the bundler
        // @ts-ignore - Using indirect require to avoid build issues
        const { PrismaAdapter } = require(adapterModule);
        config.adapter = PrismaAdapter(prisma);
      } catch (error) {
        console.warn("Failed to load PrismaAdapter, OAuth will use JWT fallback:", error);
      }
    }
  }
  
  return config;
};

// Export the complete auth options
export const authOptions = buildAuthConfig();