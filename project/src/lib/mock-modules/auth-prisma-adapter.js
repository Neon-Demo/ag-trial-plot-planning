// Mock adapter for NextAuth in demo mode
const mockUsers = [
  {
    id: "1",
    name: "Demo Admin",
    email: "admin@example.com",
    role: "ADMIN",
    organizationId: "1",
    emailVerified: new Date(),
    image: "https://ui-avatars.com/api/?name=Admin+User&background=2a9d8f&color=fff",
  },
  {
    id: "2",
    name: "Demo Researcher",
    email: "researcher@example.com",
    role: "RESEARCHER",
    organizationId: "1",
    emailVerified: new Date(),
    image: "https://ui-avatars.com/api/?name=Demo+Researcher&background=e9c46a&color=fff",
  },
  {
    id: "3",
    name: "Demo Field Tech",
    email: "fieldtech@example.com",
    role: "FIELD_TECHNICIAN",
    organizationId: "1",
    emailVerified: new Date(),
    image: "https://ui-avatars.com/api/?name=Field+Technician&background=e76f51&color=fff",
  }
];

const mockAccounts = [
  {
    id: "1",
    userId: "1",
    type: "demo",
    provider: "demo",
    providerAccountId: "admin",
  },
  {
    id: "2",
    userId: "2",
    type: "demo",
    provider: "demo",
    providerAccountId: "researcher",
  },
  {
    id: "3",
    userId: "3",
    type: "demo",
    provider: "demo",
    providerAccountId: "fieldtech",
  }
];

const mockSessions = [];

// Mock implementation of PrismaAdapter
export function PrismaAdapter() {
  return {
    createUser: async (data) => {
      const newUser = {
        id: (mockUsers.length + 1).toString(),
        ...data,
        emailVerified: new Date(),
      };
      mockUsers.push(newUser);
      return newUser;
    },
    getUser: async (id) => {
      return mockUsers.find((user) => user.id === id) || null;
    },
    getUserByEmail: async (email) => {
      return mockUsers.find((user) => user.email === email) || null;
    },
    getUserByAccount: async ({ provider, providerAccountId }) => {
      const account = mockAccounts.find(
        (account) => account.provider === provider && account.providerAccountId === providerAccountId
      );
      if (!account) return null;
      return mockUsers.find((user) => user.id === account.userId) || null;
    },
    updateUser: async (data) => {
      const userIndex = mockUsers.findIndex((user) => user.id === data.id);
      if (userIndex === -1) return null;
      
      mockUsers[userIndex] = { ...mockUsers[userIndex], ...data };
      return mockUsers[userIndex];
    },
    deleteUser: async (id) => {
      const userIndex = mockUsers.findIndex((user) => user.id === id);
      if (userIndex === -1) return null;
      
      const user = mockUsers[userIndex];
      mockUsers.splice(userIndex, 1);
      return user;
    },
    linkAccount: async (data) => {
      const newAccount = {
        id: (mockAccounts.length + 1).toString(),
        ...data,
      };
      mockAccounts.push(newAccount);
      return newAccount;
    },
    unlinkAccount: async ({ provider, providerAccountId }) => {
      const accountIndex = mockAccounts.findIndex(
        (account) => account.provider === provider && account.providerAccountId === providerAccountId
      );
      if (accountIndex === -1) return null;
      
      const account = mockAccounts[accountIndex];
      mockAccounts.splice(accountIndex, 1);
      return account;
    },
    createSession: async (data) => {
      const newSession = {
        id: (mockSessions.length + 1).toString(),
        ...data,
      };
      mockSessions.push(newSession);
      return newSession;
    },
    getSessionAndUser: async (sessionToken) => {
      const session = mockSessions.find((session) => session.sessionToken === sessionToken);
      if (!session) return null;
      
      const user = mockUsers.find((user) => user.id === session.userId);
      if (!user) return null;
      
      return { session, user };
    },
    updateSession: async (data) => {
      const sessionIndex = mockSessions.findIndex((session) => session.sessionToken === data.sessionToken);
      if (sessionIndex === -1) return null;
      
      mockSessions[sessionIndex] = { ...mockSessions[sessionIndex], ...data };
      return mockSessions[sessionIndex];
    },
    deleteSession: async (sessionToken) => {
      const sessionIndex = mockSessions.findIndex((session) => session.sessionToken === sessionToken);
      if (sessionIndex === -1) return null;
      
      const session = mockSessions[sessionIndex];
      mockSessions.splice(sessionIndex, 1);
      return session;
    },
    // Only implement the methods NextAuth actually uses
    // Unused methods can just be stubs
    createVerificationToken: async () => null,
    useVerificationToken: async () => null,
  };
}