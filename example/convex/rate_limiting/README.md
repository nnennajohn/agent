# Rate Limiting Example

This example shows how to use the `@convex-dev/rate-limiter` component to
control the rate of requests to your AI agent, preventing abuse and managing
API costs.

See [rateLimiting.ts](./rateLimiting.ts) for the server-side code.
See [RateLimiting.tsx](../../ui/RateLimiting.tsx) for the client-side code.

## Overview

The rate limiting example demonstrates two types of rate limiting:

1. **Message Rate Limiting**: Prevents users from sending messages too frequently
2. **Token Usage Rate Limiting**: Controls AI model token consumption over time

## Running the Example

```sh
npm run setup
npm run example
```

Try sending multiple questions quickly to see the rate limiting in action!

## Rate Limiting Strategy

### 1. Fixed Window Rate Limiting for Messages

```ts
sendMessage: { kind: "fixed window", period: 5 * SECOND, rate: 1, capacity: 2 }
```

- Allows 1 message every 5 seconds per user.
- Prevents spam and rapid-fire requests.
- Allows up to a 2 message burst to be sent within 5 seconds via `capacity`,
  if they had usage leftover from the previous 5 seconds.

### 2. Token Bucket Rate Limiting for Token Usage

```ts
tokenUsage: { kind: "token bucket", period: 1 * MINUTE, rate: 1000 }
```

- Allows 1000 tokens per minute per user
- Provides burst capacity while controlling overall usage
- Helps manage API costs for LLM calls

## How It Works

### Step 1: Pre-flight Rate Limit Checks

Before processing a question, the system:

1. Checks if the user can send another message (frequency limit)
2. Estimates token usage for the question
3. Verifies the user has sufficient token allowance
4. Throws an error if either limit would be exceeded

```ts
await rateLimiter.limit(ctx, "sendMessage", {
  key: userId,
  throws: true,
});
await rateLimiter.check(ctx, "tokenUsage", {
  key: userId,
  count: estimateTokens(args.question),
  throws: true,
});
```

### Step 2: Asynchronous Response Generation

If rate limits pass:

1. Creates a new thread for the conversation
2. Saves the user's message
3. Schedules AI response generation asynchronously

### Step 3: Post-generation Usage Tracking

After the AI generates a response:

1. Records actual token usage in the rate limiter
2. Uses `reserve: true` to allow temporary negative balances
3. Prevents future requests until the "debt" is paid off

```ts
await rateLimiter.limit(ctx, "tokenUsage", {
  key: userId,
  count: usage.totalTokens,
  reserve: true,
});
```

## Key Features

- **Proactive Protection**: Checks limits before expensive AI calls
- **Cost Control**: Token-based limiting prevents runaway API costs
- **Flexible Limits**: Different rate limit types for different use cases
- **Usage Tracking**: Records actual consumption for monitoring
- **Graceful Degradation**: Clear error messages when limits are hit

## Token Estimation

The example includes a simple token estimation function:

```ts
function estimateTokens(question: string) {
  // Assume roughly 4 characters per token
  return question.length / 4;
}
```

In production, you might want more sophisticated estimation based on:

- Previous message history in the thread
- Model-specific tokenization
- Different token weights for input vs output

## Testing Rate Limits

You can test the rate limits by:

1. **Message Frequency**: Try sending questions faster than once every 5 seconds
2. **Token Usage**: Send long questions or many questions to hit the 1000 token/minute limit

The system will throw descriptive errors when limits are exceeded:

- `RateLimitError` for message frequency violations
- `RateLimitError` for token usage violations

## Customization

You can adjust the rate limits in `rateLimiting.ts`:

- Change time periods (`5 * SECOND`, `1 * MINUTE`)
- Adjust rates (1 message, 1000 tokens)
- Add new rate limit types for different resources
- Implement per-user or per-tier limits
