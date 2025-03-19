// Dynamic imports to handle environments without Prisma
let PrismaClient: any;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { PrismaClient: ImportedPrismaClient } = require('@prisma/client');
  PrismaClient = ImportedPrismaClient;
} catch (error) {
  console.warn('Failed to import PrismaClient, using mock implementation only:', error);
  // Create a dummy PrismaClient class if import fails
  PrismaClient = class MockPrismaClient {};
}

let mockDeep: any, mockReset: any, DeepMockProxy: any;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mockUtils = require('jest-mock-extended');
  mockDeep = mockUtils.mockDeep;
  mockReset = mockUtils.mockReset;
  DeepMockProxy = mockUtils.DeepMockProxy;
} catch (error) {
  console.warn('Failed to import jest-mock-extended, mock capabilities limited:', error);
  // Create simple mock functions if import fails
  mockDeep = () => ({});
  mockReset = () => {};
  DeepMockProxy = () => {};
}

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
  var cachedPrisma: any;
}

// Determine if we should use a mock client based on demo mode
const isDemoMode = () => 
  process.env.ALLOW_DEMO_LOGIN === 'true' || process.env.NODE_ENV === 'development';

// Create the actual client or mock based on config
export function createPrismaClient() {
  if (isDemoMode() || !process.env.DATABASE_URL) {
    console.log('Using mock Prisma client for demo mode');
    try {
      return mockDeep ? (mockDeep() as unknown as MockPrismaClient) : new MockPrismaClient();
    } catch (error) {
      console.warn('Error creating mock client, falling back to basic mock:', error);
      return new MockPrismaClient();
    }
  }
  
  try {
    console.log('Using real Prisma client');
    return new PrismaClient();
  } catch (error) {
    console.warn('Error creating Prisma client, falling back to mock:', error);
    return new MockPrismaClient();
  }
}

// Use global var for caching during development to prevent connection overload
let cachedPrisma: any;
try {
  cachedPrisma = global.cachedPrisma || createPrismaClient();
  
  if (process.env.NODE_ENV !== 'production') {
    global.cachedPrisma = cachedPrisma;
  }
} catch (error) {
  console.warn('Error with Prisma client caching, creating new instance:', error);
  cachedPrisma = createPrismaClient();
}

export const prisma = cachedPrisma;