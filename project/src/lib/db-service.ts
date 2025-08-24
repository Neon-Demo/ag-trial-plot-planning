import { db } from "./db";
import { User, Organization, UserOrganization, Trial, Plot } from "@prisma/client";

// User services
export async function getUserById(id: string) {
  return db.user.findUnique({
    where: { id },
    include: {
      organizations: {
        include: {
          organization: true
        }
      }
    }
  });
}

export async function getUserByEmail(email: string) {
  return db.user.findUnique({
    where: { email },
    include: {
      organizations: {
        include: {
          organization: true
        }
      }
    }
  });
}

// Organization services
export async function getOrganizationById(id: string) {
  return db.organization.findUnique({
    where: { id },
    include: {
      users: {
        include: {
          user: true
        }
      }
    }
  });
}

export async function getOrganizationByUserId(userId: string) {
  return db.userOrganization.findMany({
    where: { userId },
    include: {
      organization: true
    }
  });
}

// Trial services
export async function getTrialsByOrganizationId(organizationId: string) {
  return db.trial.findMany({
    where: { organizationId },
    include: {
      plots: true
    }
  });
}

export async function getTrialsByUserId(userId: string) {
  const userOrgs = await db.userOrganization.findMany({
    where: { userId },
    select: { organizationId: true }
  });
  
  const orgIds = userOrgs.map(org => org.organizationId);
  
  return db.trial.findMany({
    where: {
      organizationId: { in: orgIds }
    }
  });
}

// Plot services
export async function getPlotsByTrialId(trialId: string) {
  return db.plot.findMany({
    where: { trialId },
    include: {
      treatment: true,
      observations: true
    }
  });
}

// Generic services - can be used for any model
export async function create<T>(model: string, data: any): Promise<T> {
  return (db as any)[model].create({
    data
  });
}

export async function update<T>(model: string, id: string, data: any): Promise<T> {
  return (db as any)[model].update({
    where: { id },
    data
  });
}

export async function remove(model: string, id: string): Promise<void> {
  await (db as any)[model].delete({
    where: { id }
  });
}