"use client";

import { createContext, useContext, ReactNode } from "react";
import { PrismaClient } from "@prisma/client";
import { db } from "./db";

// Create a context for the database
type DatabaseContextType = {
  db: PrismaClient;
};

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

// Create a provider component
export function DatabaseProvider({ children }: { children: ReactNode }) {
  return (
    <DatabaseContext.Provider value={{ db }}>
      {children}
    </DatabaseContext.Provider>
  );
}

// Create a hook to use the db context
export function useDatabase() {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error("useDatabase must be used within a DatabaseProvider");
  }
  return context;
}