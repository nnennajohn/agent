# Agent Playground

This is a playground for @convex-dev/agent.

![Playground Screenshot](./public/screenshot.png)

- Pick a user to list their threads.
- Browse the user's threads.
- List the selected thread's messages, along with tool call details.
- Show message metadata details.
- Experiment with contextual message lookup, adjusting context options.
- Send a message to the thread, with configurable saving options.
- It uses api keys to communicate securely with the backend.

There is also a [hosted version here](https://get-convex.github.io/agent/).

# Setup

```sh
npm i @convex-dev/agent-playground
```

In your agent Convex project, make a file `convex/playground.ts` with:

```ts
import { definePlaygroundAPI } from "@convex-dev/agent-playground";
import { components } from "./_generated/api";
import { weatherAgent, fashionAgent } from "./example";

/**
 * Here we expose the API so the frontend can access it.
 * Authorization is handled by passing up an apiKey that can be generated
 * on the dashboard or via CLI via:
 * ```
 * npx convex run --component agent apiKeys:issue
 * ```
 */
export const {
  isApiKeyValid,
  listAgents,
  listUsers,
  listThreads,
  listMessages,
  createThread,
  generateText,
  fetchPromptContext,
} = definePlaygroundAPI(components.agent, {
  agents: [weatherAgent, fashionAgent],
});
```

From in your project's repo, issue yourself an API key:

```sh
npx convex run --component agent apiKeys:issue '{name:"..."}'
```
Note: to generate multiple keys, give a different name to each key.
To revoke and reissue a key, pass the same name.

Then run the playground:

```sh
npx @convex-dev/agent-playground
```

It uses the `VITE_CONVEX_URL` env variable, usually pulling it from .env.local.

- Enter the API key in the box.
- If you used a different path for `convex/playground.ts` you can enter it.
  E.g. if you had `convex/foo/bar.ts` where you exported the playground API,
  you'd put in `foo/bar`.
