# Chat Examples

This example shows how to use the `@convex-dev/agent` component to build a basic
chat application.

## Running it:

From the **root** of the repo, run:

```sh
npm run setup
npm run example
```

## Server-side sending messages



For streaming, it will save deltas to the database, so all clients querying for
messages will get the stream.

## Server-side listing messages

See [chat/basic.ts](./basic.ts) for the server-side code,
and [chat/streaming.ts](./streaming.ts) for the streaming example.

You have a function that both allows paginating over messages.
To support streaming, you can also take in a `streamArgs` object and return the
`streams` result from `syncStreams`.

```ts
import { paginationOptsValidator } from "convex/server";
import { vStreamArgs, listMessages, syncStreams } from "@convex-dev/agent";
import { components } from "../_generated/api";

 export const listThreadMessages = query({
   args: {
     threadId: v.string(),
     paginationOpts: paginationOptsValidator,
     streamArgs: vStreamArgs,
   },
   handler: async (ctx, { threadId, paginationOpts, streamArgs }) => {
     // await authorizeThreadAccess(ctx, threadId);

     const paginated = await listMessages(ctx, components.agent, { threadId, paginationOpts });
     const streams = await syncStreams(ctx, components.agent, { threadId, streamArgs });

     // Here you could filter out / modify the documents & stream deltas.
     return { ...paginated, streams };
   },
 });
```


## Client-side code

See [ChatStreaming.tsx](../../ui/ChatStreaming.tsx) for a streaming example,
or [ChatBasic.tsx](../../ui/ChatBasic.tsx) for a non-streaming example.

The crux is to use the `useThreadMessages` hook.
For streaming, you can pass in `stream: true` to the hook.

```tsx
import { api } from "../convex/_generated/api";
import { useThreadMessages, toUIMessages } from "@convex-dev/agent/react";

function MyComponent({ threadId }: { threadId: string }) {
  const messages = useThreadMessages(
    api.chat.basic.listMessages,
    // api.chat.streaming.listMessages,
    { threadId },
    { initialNumItems: 10 },
    // { initialNumItems: 10, stream: true },
  );
  return (
    <div>
      {toUIMessages(messages.results ?? []).map((message) => (
        <div key={message.key}>{message.content}</div>
      ))}
    </div>
  );
}
```

### Optimistic updates for sending messages

The `optimisticallySendMessage` function is a helper function for sending a
message, so you can optimistically show a message in the message list until the
mutation has completed on the server.

Pass in the query that you're using to list messages, and it will insert the
ephemeral message at the top of the list.

```ts
const sendMessage = useMutation(api.streaming.streamStoryAsynchronously)
  .withOptimisticUpdate(optimisticallySendMessage(api.streaming.listThreadMessages));
```

If your arguments don't include `{ threadId, prompt }` then you can use it as a
helper function in your optimistic update:

```ts
import { optimisticallySendMessage } from "@convex-dev/agent/react";

const sendMessage = useMutation(
  api.chatStreaming.streamStoryAsynchronously,
).withOptimisticUpdate(
  (store, args) => {
    optimisticallySendMessage(api.chatStreaming.listThreadMessages)(store, {
      threadId: /* get the threadId from your args / context */,
      prompt: /* change your args into the user prompt. */,
    })
  }
);
```


### Text smoothing

The `useSmoothText` hook is a simple hook that smooths the text as it is streamed.

```ts
import { useSmoothText } from "@convex-dev/agent/react";

// in the component
  const [visibleText] = useSmoothText(message.content);
```

You can configure the initial characters per second. It will adapt over time to
match the average speed of the text coming in.

By default it won't stream the first text it receives unless you pass in
`startStreaming: true`. To start streaming immediately when you have a mix of
streaming and non-streaming messages, you can pass in

```ts
function Message({ message }: { message: UIMessage }) {
  const [visibleText] = useSmoothText(message.content, {
    startStreaming: message.status === "streaming",
  });
  return <div>{visibleText}</div>;
}
```






See [ChatStreaming.tsx](../../ui/ChatStreaming.tsx) for an example.
