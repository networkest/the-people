import { z } from "zod";
import { protectedProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { forumThreads, forumMessages } from "../drizzle/schema";
import { eq, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const forumRouter = router({
  // Get all threads
  getThreads: protectedProcedure.query(async ({ ctx }) => {
    try {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      const threads = await db
        .select()
        .from(forumThreads)
        .orderBy(desc(forumThreads.isPinned), desc(forumThreads.updatedAt));

      return threads;
    } catch (error) {
      console.error("[Forum] Failed to get threads:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch threads",
      });
    }
  }),

  // Get single thread with messages
  getThread: protectedProcedure
    .input(z.object({ threadId: z.number() }))
    .query(async ({ ctx, input }) => {
      try {
        const db = await getDb();
        if (!db) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Database not available",
          });
        }

        const thread = await db
          .select()
          .from(forumThreads)
          .where(eq(forumThreads.id, input.threadId))
          .limit(1);

        if (thread.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Thread not found",
          });
        }

        const messages = await db
          .select()
          .from(forumMessages)
          .where(eq(forumMessages.threadId, input.threadId))
          .orderBy(forumMessages.createdAt);

        return {
          thread: thread[0],
          messages,
        };
      } catch (error) {
        console.error("[Forum] Failed to get thread:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch thread",
        });
      }
    }),

  // Create new thread
  createThread: protectedProcedure
    .input(
      z.object({
        title: z.string().min(3).max(255),
        content: z.string().min(10),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const db = await getDb();
        if (!db) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Database not available",
          });
        }

        const result = await db.insert(forumThreads).values({
          userId: ctx.user.id,
          title: input.title,
          content: input.content,
          isPinned: false,
          isLocked: false,
          messageCount: 0,
        });

        return result;
      } catch (error) {
        console.error("[Forum] Failed to create thread:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create thread",
        });
      }
    }),

  // Add message to thread
  addMessage: protectedProcedure
    .input(
      z.object({
        threadId: z.number(),
        content: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const db = await getDb();
        if (!db) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Database not available",
          });
        }

        // Check if thread exists
        const thread = await db
          .select()
          .from(forumThreads)
          .where(eq(forumThreads.id, input.threadId))
          .limit(1);

        if (thread.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Thread not found",
          });
        }

        // Add message
        await db.insert(forumMessages).values({
          threadId: input.threadId,
          userId: ctx.user.id,
          content: input.content,
          isEdited: false,
        });

        // Update message count
        if (thread[0]) {
          await db
            .update(forumThreads)
            .set({ messageCount: (thread[0].messageCount || 0) + 1 })
            .where(eq(forumThreads.id, input.threadId));
        }

        return { success: true };
      } catch (error) {
        console.error("[Forum] Failed to add message:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to add message",
        });
      }
    }),

  // Get forum statistics
  getStats: protectedProcedure.query(async ({ ctx }) => {
    try {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      const threads = await db.select().from(forumThreads);
      const messages = await db.select().from(forumMessages);

      const totalThreads = threads.length;
      const totalMessages = messages.length;
      const totalMembers = new Set(threads.map(t => t.userId)).size;

      return {
        totalThreads,
        totalMessages,
        totalMembers,
      };
    } catch (error) {
      console.error("[Forum] Failed to get stats:", error);
      return {
        totalThreads: 0,
        totalMessages: 0,
        totalMembers: 0,
      };
    }
  }),
});
