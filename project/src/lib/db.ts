import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';

// Demo mode mock data
import { demoUsers } from './demo-data';

// DEMO MODE IMPLEMENTATION
// This class provides a mock implementation for when we're using demo login
class MockPrismaClient {
  user = {
    findUnique: async ({ where }: any) => {
      if (where.email) {
        return demoUsers.find(user => user.email === where.email) || null;
      }
      if (where.id) {
        return demoUsers.find(user => user.id === where.id) || null;
      }
      return null;
    },
    findFirst: async ({ where }: any) => {
      if (where.email) {
        return demoUsers.find(user => user.email === where.email) || null;
      }
      return null;
    },
    create: async ({ data }: any) => {
      return { ...data, id: 'mock-id-' + Date.now() };
    },
  };
  
  account = {
    create: async ({ data }: any) => {
      return { ...data, id: 'mock-account-id-' + Date.now() };
    },
    findFirst: async () => null,
  };
  
  session = {
    create: async ({ data }: any) => {
      return { ...data, id: 'mock-session-id-' + Date.now() };
    },
    findUnique: async () => null,
    findMany: async () => [],
    deleteMany: async () => ({ count: 0 }),
    update: async ({ data }: any) => {
      return { ...data, id: 'mock-session-id-' + Date.now() };
    },
  };
}

// Singleton pattern for PrismaClient to avoid multiple instances during hot reload
// Global prevents multiple instances in development
declare global {
  var cachedPrisma: PrismaClient | undefined;
}

// Determine if we should use a mock client based on demo mode
const isDemoMode = () => 
  process.env.ALLOW_DEMO_LOGIN === 'true' || process.env.NODE_ENV === 'development';

// Create the actual client or mock based on config
export function createPrismaClient() {
  if (isDemoMode()) {
    console.log('Using mock Prisma client for demo mode');
    return mockDeep<PrismaClient>() as unknown as MockPrismaClient;
  }
  
  console.log('Using real Prisma client');
  return new PrismaClient();
}

// Use global var for caching during development to prevent connection overload
export const prisma = global.cachedPrisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.cachedPrisma = prisma;
}