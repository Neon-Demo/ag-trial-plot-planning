// This file provides a mock for @auth/prisma-adapter
// It will be used in demo mode through module aliasing

exports.PrismaAdapter = function(prisma) {
  console.log('Using mock PrismaAdapter');
  
  return {
    createUser: async () => ({ id: 'mock-id', email: 'mock@example.com' }),
    getUser: async () => null,
    getUserByEmail: async () => null,
    getUserByAccount: async () => null,
    updateUser: async (data) => data,
    deleteUser: async () => null,
    linkAccount: async () => null,
    unlinkAccount: async () => null,
    getAccount: async () => null,
    getSessionAndUser: async () => null,
    createSession: async () => null,
    updateSession: async () => null,
    deleteSession: async () => null,
    createVerificationToken: async () => null,
    useVerificationToken: async () => null,
  };
};