import { internal } from "../_generated/api";
import { action, internalAction, mutation, query } from "../_generated/server";
import { v } from "convex/values";
import { agent } from "../agents/simple";
import { authorizeThreadAccess } from "../threads";
import { paginationOptsValidator } from "convex/server";

/**
 * OPTION 1:
 * Generating via a single action call
 */

export const generateTextInAnAction = action({
  args: { prompt: v.string(), threadId: v.string() },
  handler: async (ctx, { prompt, threadId }) => {
    await authorizeThreadAccess(ctx, threadId);
    const { thread } = await agent.continueThread(ctx, { threadId });
    const result = await thread.generateText({ prompt });
    return result.text;
  },
});

/**
 * OPTION 2 (RECOMMENDED):
 * Generating via a mutation & async action
 * This enables optimistic updates on the client.
 */

// Save a user message, and kick off an async response.
export const sendMessage = mutation({
  args: { prompt: v.string(), threadId: v.string() },
  handler: async (ctx, { prompt, threadId }) => {
    await authorizeThreadAccess(ctx, threadId);
    const { messageId } = await agent.saveMessage(ctx, {
      threadId,
      prompt,
    });
    await ctx.scheduler.runAfter(0, internal.chat.basic.generateResponse, {
      threadId,
      promptMessageId: messageId,
    });
  },
});

// Generate a response to a user message.
// Any clients listing the messages will automatically get the new message.
export const generateResponse = internalAction({
  args: { promptMessageId: v.string(), threadId: v.string() },
  handler: async (ctx, { promptMessageId, threadId }) => {
    const { thread } = await agent.continueThread(ctx, { threadId });
    await thread.generateText({ promptMessageId });
  },
});

/**
 * Query & subscribe to messages & threads
 */

export const listMessages = query({
  args: {
    threadId: v.string(),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const { threadId, paginationOpts } = args;
    await authorizeThreadAccess(ctx, threadId);
    const messages = await agent.listMessages(ctx, {
      threadId,
      paginationOpts,
    });
    // You could add more fields here, join with other tables, etc.
    return messages;
  },
});
