# RAG (Retrieval-Augmented Generation) Examples

This directory contains examples of how to use the Convex Agent component with
RAG (Retrieval-Augmented Generation) to build AI applications that can
search through and reference custom knowledge bases.

While the Agent component has built-in capabilities to search message history
with hybrid text & vector search, you can use the RAG component to add other
data to search for context.

## What is RAG?

RAG combines the power of Large Language Models (LLMs) with external knowledge retrieval.
Instead of relying solely on the model's training data, RAG allows your AI to:

- Search through custom documents and knowledge bases
- Retrieve relevant context for answering questions
- Provide more accurate, up-to-date, and domain-specific responses
- Cite sources and explain what information was used

### RAG Component features

See the [RAG component docs](https://convex.dev/components/rag) for full details, but here are some key features:

- **Namespaces:** Use namespaces for user-specific or team-specific data to isolate search domains.
- **Add Content**: Add or replace text content by key.
- **Semantic Search**: Vector-based search using configurable embedding models
- **Custom Filtering:** Define filters on each document for efficient vector search.
- **Chunk Context**: Get surrounding chunks for better context.
- **Importance Weighting**: Weight content by providing a 0 to 1 "importance" to affect per-document vector search results.
- **Chunking flexibility:** Bring your own document chunker, or use the default.
- **Graceful Migrations**: Migrate content or whole namespaces without disruption.

## RAG Approaches

This directory contains two different approaches to implementing RAG:

### 1. Basic RAG (`ragBasic.ts`)

A straightforward implementation where the system automatically searches for relevant context for a user query.

- The message history will only include the original user prompt and the response, not the context.
- Looks up the context and injects it into the user's prompt.
- Works well if you know the user's question will *always* benefit from extra context.

See [ragBasic.ts](./ragBasic.ts) for the overall code. The simplest version is:
```ts
const { thread } = await agent.continueThread(ctx, { threadId });
const context = await rag.search(ctx, {
    namespace: "global",
    query: userPrompt,
    limit: 10,
    chunkContext: { before: 1, after: 1 },
});

const result = await thread.generateText({
    prompt: `# Context:\n\n ${context.text}\n\n---\n\n# Question:\n\n"""${rawPrompt}\n"""`,
});
```

### 2. Tool-based RAG (`ragWithTools.ts`)

An advanced implementation where the AI agent can intelligently decide when to search for context or add new information.

- The message history will include the original user prompt, the context (via tool call messages), and the response.
- The AI agent can decide when to search for context or add new information.
- Works well if you want the AI agent to be able to dynamically search when it wants to.

See [ragWithTools.ts](./ragWithTools.ts) for the code. The simplest version is:

```ts
searchContext: createTool({
  description: "Search for context related to this user prompt",
  args: z.object({ query: z.string().describe("Describe the context you're looking for") }),
    handler: async (ctx, { query }) => {
    const context = await rag.search(ctx, { namespace: userId, query });
    return context.text;
  },
}),
```

## Key Differences

| Feature              | Basic RAG                    | Tool-based RAG                         |
| -------------------- | ---------------------------- | -------------------------------------- |
| **Context Search**   | Always searches              | AI decides when to search              |
| **Adding Context**   | Manual via separate function | AI can add context during conversation |
| **Flexibility**      | Simple, predictable          | Intelligent, adaptive                  |
| **Use Case**         | FAQ systems, document search | Dynamic knowledge management           |
| **Predictability**   | Defined by code              | AI may query too much or little        |

## Examples in Action

To see these examples in action, check out the demo UI in the parent directory which provides:

- Interactive chat interface
- Context management UI
- Browse the chunks of documents in the RAG component
- Search result visualization
- Real-time streaming responses

Run the examples with:

```bash
npm run example
```
