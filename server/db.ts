import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, members, contributions, InsertMember, InsertContribution } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createMember(memberId: InsertMember) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create member: database not available");
    return undefined;
  }

  try {
    const result = await db.insert(members).values(memberId);
    return result;
  } catch (error) {
    console.error("[Database] Failed to create member:", error);
    throw error;
  }
}

export async function getMemberByUserId(userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get member: database not available");
    return undefined;
  }

  const result = await db.select().from(members).where(eq(members.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateMember(userId: number, updates: Partial<InsertMember>) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update member: database not available");
    return undefined;
  }

  try {
    await db.update(members).set(updates).where(eq(members.userId, userId));
  } catch (error) {
    console.error("[Database] Failed to update member:", error);
    throw error;
  }
}

export async function createContribution(contribution: InsertContribution) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create contribution: database not available");
    return undefined;
  }

  try {
    const result = await db.insert(contributions).values(contribution);
    return result;
  } catch (error) {
    console.error("[Database] Failed to create contribution:", error);
    throw error;
  }
}

export async function getContributionsByUserId(userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get contributions: database not available");
    return [];
  }

  try {
    const result = await db.select().from(contributions).where(eq(contributions.userId, userId));
    return result;
  } catch (error) {
    console.error("[Database] Failed to get contributions:", error);
    return [];
  }
}

export async function updateContributionStatus(id: number, status: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update contribution: database not available");
    return undefined;
  }

  try {
    await db.update(contributions).set({ status: status as any }).where(eq(contributions.id, id));
  } catch (error) {
    console.error("[Database] Failed to update contribution:", error);
    throw error;
  }
}

export async function updateUserMembershipStatus(userId: number, isMember: boolean, status: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update user: database not available");
    return undefined;
  }

  try {
    await db.update(users).set({
      isMember,
      membershipStatus: status as any,
      joinedAt: isMember ? new Date() : null,
    }).where(eq(users.id, userId));
  } catch (error) {
    console.error("[Database] Failed to update user membership:", error);
    throw error;
  }
}

export async function getCollectiveStats() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get stats: database not available");
    return { totalMembers: 0, totalPooled: "0", totalInterest: "0" };
  }

  try {
    const memberCount = await db.select().from(members);
    const allContributions = await db.select().from(contributions).where(eq(contributions.status, "completed"));
    
    let totalPooled = 0;
    allContributions.forEach(c => {
      totalPooled += parseFloat(c.amount.toString());
    });

    return {
      totalMembers: memberCount.length,
      totalPooled: totalPooled.toFixed(2),
      totalInterest: "0", // Would be calculated from actual interest earnings
    };
  } catch (error) {
    console.error("[Database] Failed to get stats:", error);
    return { totalMembers: 0, totalPooled: "0", totalInterest: "0" };
  }
}
