# Convex Agent Component

[![npm version](https://badge.fury.io/js/@convex-dev%2fagent.svg)](https://badge.fury.io/js/@convex-dev%2fagent)

```sh
npm i @convex-dev/agent
```
<!-- START: Include on https://convex.dev/components -->

AI Agent framework built on Convex.

Read the [docs](https://docs.convex.dev/agents) for more details.

- Agents organize LLM prompting with associated models, prompts, and
  [Tool Calls](./docs/tools.md).
- [Threads](./docs/threads.md) persist [messages](./docs/messages.md) and can be
  shared by multiple users and agents (including
  [human agents](./docs/human-agents.md)).
- Streaming text and objects using deltas over websockets so all clients stay in
  sync without http streaming.
- [Conversation context](./docs/context.md) is automatically included in each LLM
  call, including built-in hybrid vector/text search for messages.
  Opt-in search for messages from other threads (for the same specified user).
- [Workflows](./docs/workflows.md) allow building multi-step operations that can
  span agents, users, durably and reliably.
- [RAG](./docs/rag.md) techniques are also supported for prompt augmentation
  either up front or as tool calls using the [RAG Component](https://www.convex.dev/components/rag).
- [Files](./docs/files.md) can be used in the chat history with automatic saving
  to [file storage](https://docs.convex.dev/file-storage).
- [Debugging](./docs/debugging.md) is supported, including the
  [agent playground](./docs/playground.md) where you can inspect all metadata
  and iterate on prompts and context settings.
- [Usage tracking](./docs/usage-tracking.md) enables usage billing for users and teams.
- [Rate limiting](./docs/rate-limiting.md) helps control the rate at which users
  can interact with agents and keep you from exceeding your LLM provider's limits.

[Read the associated Stack post here](https://stack.convex.dev/ai-agents).

[![Powerful AI Apps Made Easy with the Agent Component](https://thumbs.video-to-markdown.com/b323ac24.jpg)](https://youtu.be/tUKMPUlOCHY)

Play with the [example](./example/) by cloning this repo and running:

```sh
git clone https://github.com/get-convex/agent.git
cd agent
npm run setup
npm run example
```

Found a bug? Feature request? [File it here](https://github.com/get-convex/agent/issues).

## Extra control: how to do more things yourself

### Generating text for a user without an associated thread

```ts
const result = await supportAgent.generateText(ctx, { userId }, { prompt });
```

<!-- END: Include on https://convex.dev/components -->
[![DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/get-convex/agent)
