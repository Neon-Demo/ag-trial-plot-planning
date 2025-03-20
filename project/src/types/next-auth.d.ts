import { DefaultSession, User as NextAuthUser } from "next-auth";
import { UserRole } from "@prisma/client";

declare module "next-auth" {
  interface User extends NextAuthUser {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    organizationId?: string;
  }

  interface Session extends DefaultSession {
    user: User & {
      id: string;
      name: string;
      email: string;
      role: UserRole;
      organizationId?: string;
    };
  }
}