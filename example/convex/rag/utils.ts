import { vStreamArgs } from "@convex-dev/agent";
import { vEntryId, vSearchEntry, vSearchResult } from "@convex-dev/rag";
import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { agent } from "../chatBasic";
import { internalMutation, mutation, query } from "../_generated/server";
import { getAuthUserId } from "../utils";
import { rag } from "./ragBasic";

export const createThread = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    const { threadId } = await agent.createThread(ctx, { userId });
    return threadId;
  },
});

export const listMessages = query({
  args: {
    threadId: v.string(),
    paginationOpts: paginationOptsValidator,
    streamArgs: vStreamArgs,
  },
  handler: async (ctx, args) => {
    const results = await agent.listMessages(ctx, {
      threadId: args.threadId,
      paginationOpts: args.paginationOpts,
    });
    const streams = await agent.syncStreams(ctx, {
      threadId: args.threadId,
      streamArgs: args.streamArgs,
    });
    return {
      streams,
      ...results,
      page: await Promise.all(
        results.page.map(async (message) => ({
          ...message,
          contextUsed: await ctx.db
            .query("contextUsed")
            .withIndex("messageId", (q) => q.eq("messageId", message._id))
            .first(),
        })),
      ),
    };
  },
});

export const listEntries = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const namespace = await rag.getNamespace(ctx, {
      namespace: "global",
    });
    if (!namespace) {
      return { page: [], isDone: true, continueCursor: "" };
    }
    const results = await rag.list(ctx, {
      namespaceId: namespace.namespaceId,
      paginationOpts: args.paginationOpts,
    });
    return results;
  },
});

export const listChunks = query({
  args: {
    entryId: vEntryId,
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const paginatedChunks = await rag.listChunks(ctx, {
      entryId: args.entryId,
      paginationOpts: args.paginationOpts,
    });
    return paginatedChunks;
  },
});

export const recordContextUsed = internalMutation({
  args: {
    messageId: v.string(),
    entries: v.array(vSearchEntry),
    results: v.array(vSearchResult),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("contextUsed", args);
  },
});
