/**
 * This file safely exports a PrismaAdapter version that won't break builds
 * when the actual module is not available (demo mode without database).
 */

// Don't import PrismaClient directly to avoid build errors
// We'll use 'any' type instead for maximum compatibility
type PrismaClientType = any;

/**
 * Safely attempt to load the PrismaAdapter
 */
export async function getPrismaAdapter() {
  // Only attempt to actually load if we're in a non-demo environment with a DB URL
  if (process.env.NODE_ENV === 'production' && process.env.DATABASE_URL) {
    try {
      // Using dynamic import instead of require
      const AuthPrisma = await import('@auth/prisma-adapter').catch(() => null);
      if (AuthPrisma && AuthPrisma.PrismaAdapter) {
        return AuthPrisma.PrismaAdapter;
      }
    } catch (error) {
      console.warn('Failed to load @auth/prisma-adapter:', error);
    }
  }
  
  // For development, we'll just log
  console.warn('Using mock PrismaAdapter - database features disabled');

  // Return a dummy adapter function that will not be used
  // This prevents build errors when the real adapter is not available
  return (client: PrismaClientType) => {
    console.warn('Using dummy PrismaAdapter - database features disabled');
    return {
      // Minimal implementation to avoid errors
      createUser: async () => ({ id: 'dummy', email: '', emailVerified: null }),
      getUser: async () => null,
      getUserByEmail: async () => null,
      getUserByAccount: async () => null,
      updateUser: async (data: any) => data,
      linkAccount: async () => ({}),
      createSession: async () => ({}),
      getSessionAndUser: async () => null,
      updateSession: async () => ({}),
      deleteSession: async () => {},
    };
  };
}