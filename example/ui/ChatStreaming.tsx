import { useMutation } from "convex/react";
import { Toaster } from "./components/ui/toaster";
import { api } from "../convex/_generated/api";
import {
  optimisticallySendMessage,
  toUIMessages,
  useSmoothText,
  useThreadMessages,
  type UIMessage,
} from "@convex-dev/agent/react";
import { useCallback, useEffect, useState } from "react";

function getThreadIdFromHash() {
  return window.location.hash.replace(/^#/, "") || undefined;
}

export default function ChatStreaming() {
  const createThread = useMutation(api.threads.createNewThread);
  const [threadId, setThreadId] = useState<string | undefined>(
    typeof window !== "undefined" ? getThreadIdFromHash() : undefined,
  );

  // Listen for hash changes
  useEffect(() => {
    function onHashChange() {
      setThreadId(getThreadIdFromHash());
    }
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const resetThread = useCallback(() => {
    void createThread({
      title: "Streaming Chat Example",
    }).then((newId) => {
      window.location.hash = newId;
      setThreadId(newId);
    });
  }, [createThread]);

  // On mount or when threadId changes, if no threadId, create one and set hash
  useEffect(() => {
    if (!threadId) {
      void resetThread();
    }
  }, [resetThread, threadId]);

  return (
    <>
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm p-4 flex justify-between items-center border-b">
        <h1 className="text-xl font-semibold accent-text">
          Streaming Chat Example
        </h1>
      </header>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <main className="flex-1 flex items-center justify-center p-8">
          {threadId ? (
            <>
              <Story threadId={threadId} reset={resetThread} />
            </>
          ) : (
            <div className="text-center text-gray-500">Loading...</div>
          )}
        </main>
        <Toaster />
      </div>
    </>
  );
}

function Story({ threadId, reset }: { threadId: string; reset: () => void }) {
  const messages = useThreadMessages(
    api.chat.streaming.listMessages,
    { threadId },
    { initialNumItems: 10, stream: true },
  );
  const sendMessage = useMutation(
    api.chat.streaming.initiateAsyncStreaming,
  ).withOptimisticUpdate(
    optimisticallySendMessage(api.chat.streaming.listMessages),
  );
  const [prompt, setPrompt] = useState("Tell me a story");

  function onSendClicked() {
    if (prompt.trim() === "") return;
    void sendMessage({ threadId, prompt }).catch(() => setPrompt(prompt));
    setPrompt("");
  }

  return (
    <>
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6 flex flex-col gap-6">
        {messages.results?.length > 0 && (
          <div className="flex flex-col gap-4 overflow-y-auto mb-4">
            {toUIMessages(messages.results ?? []).map((m) => (
              <Message key={m.key} message={m} />
            ))}
          </div>
        )}
        <form
          className="flex gap-2 items-center"
          onSubmit={(e) => {
            e.preventDefault();
            onSendClicked();
          }}
        >
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
            placeholder={
              messages.results?.length > 0
                ? "Continue the story..."
                : "Tell me a story..."
            }
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-semibold disabled:opacity-50"
            disabled={!prompt.trim()}
          >
            Send
          </button>
          {messages.results?.length > 0 && (
            <button
              className="px-4 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition font-medium self-end"
              onClick={() => reset()}
              type="button"
            >
              Reset
            </button>
          )}
        </form>
      </div>
    </>
  );
}

function Message({ message }: { message: UIMessage }) {
  const isUser = message.role === "user";
  const [visibleText] = useSmoothText(message.content, {
    // This tells the hook that it's ok to start streaming immediately.
    // If this was always passed as true, messages that are already done would
    // also stream in.
    // IF this was always passed as false (default), then the streaming message
    // wouldn't start streaming until the second chunk was received.
    startStreaming: message.status === "streaming",
  });
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`rounded-lg px-4 py-2 max-w-lg whitespace-pre-wrap shadow-sm ${
          isUser ? "bg-blue-100 text-blue-900" : "bg-gray-200 text-gray-800"
        }`}
      >
        {visibleText}
      </div>
    </div>
  );
}
