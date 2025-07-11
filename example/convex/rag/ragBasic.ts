import { Agent } from "@convex-dev/agent";
import { RAG } from "@convex-dev/rag";
import { v } from "convex/values";
import { components, internal } from "../_generated/api";
import { action, internalAction, mutation } from "../_generated/server";
import { chat, textEmbedding } from "../../examplesModels";

export const rag = new RAG(components.rag, {
  textEmbeddingModel: textEmbedding,
  embeddingDimension: 1536,
});

export const agent = new Agent(components.agent, {
  name: "Basic Agent",
  chat: chat,
  instructions: "Explain what context you used to answer the user's question.",
});

export const addContext = action({
  args: { title: v.string(), text: v.string() },
  handler: async (ctx, args) => {
    await rag.add(ctx, {
      namespace: "global", // Could set a per-user namespace here
      title: args.title,
      key: args.title,
      text: args.text,
    });
  },
});

export const sendMessage = mutation({
  args: { threadId: v.string(), prompt: v.string() },
  handler: async (ctx, { threadId, prompt }) => {
    const { messageId } = await agent.saveMessage(ctx, {
      threadId,
      prompt,
    });
    await ctx.scheduler.runAfter(0, internal.rag.ragBasic.streamAsync, {
      threadId,
      prompt,
      promptMessageId: messageId,
    });
  },
});

export const streamAsync = internalAction({
  args: {
    threadId: v.string(),
    prompt: v.string(),
    promptMessageId: v.string(),
  },
  handler: async (ctx, { threadId, prompt: rawPrompt, promptMessageId }) => {
    const { thread } = await agent.continueThread(ctx, { threadId });
    const context = await rag.search(ctx, {
      namespace: "global",
      query: rawPrompt,
      limit: 2,
      chunkContext: { before: 1, after: 1 },
    });
    // Basic prompt to instruct the LLM to use the context to answer the question.
    // Note: for gemini / claude, using `<context>` and `<question>` tags is
    // recommended instead of the markdown format below.
    const prompt = `# Context:\n\n ${context.text}\n\n---\n\n# Question:\n\n"""${rawPrompt}\n"""`;

    const result = await thread.streamText(
      // By providing both prompt and promptMessageId, it will use the prompt
      // in place of the promptMessageId's message, but still be considered
      // a response to the promptMessageId message.
      { prompt, promptMessageId },
      { saveStreamDeltas: true }, // to enable streaming the response via websockets.
    );
    // To show the context in the demo UI, we record the context used
    await ctx.runMutation(internal.rag.utils.recordContextUsed, {
      messageId: result.messageId,
      entries: context.entries,
      results: context.results,
    });
    await result.consumeStream();
  },
});
