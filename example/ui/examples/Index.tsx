import { Link } from "react-router-dom";

export function Index() {
  return (
    <>
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold mb-4">Agent Example Index</h1>
        <p className="mb-6 text-lg">
          Explore the available agent/AI examples below. You can also{" "}
          <span className="font-mono bg-gray-100 px-2 py-1 rounded">cd</span>{" "}
          into an{" "}
          <span className="font-mono bg-gray-100 px-2 py-1 rounded">
            examples
          </span>{" "}
          directory and run just that example directly.
        </p>
        <ul className="space-y-4">
          <li className="border rounded p-4 hover:shadow transition">
            <Link
              to="/chat-basic"
              className="text-xl font-semibold text-indigo-700 hover:underline"
            >
              Basic Chat
            </Link>
            <p className="mt-2 text-gray-700">
              A simple chat with an AI agent. No tool calls, no streaming. Just
              enough to see it in action.
            </p>
          </li>
          <li className="border rounded p-4 hover:shadow transition">
            <Link
              to="/chat-streaming"
              className="text-xl font-semibold text-indigo-700 hover:underline"
            >
              Streaming Chat
            </Link>
            <p className="mt-2 text-gray-700">
              A simple streaming chat interface with an AI agent. Shows how to
              stream responses from an LLM in real time (without HTTP
              streaming!).
            </p>
          </li>
          <li className="border rounded p-4 hover:shadow transition">
            <Link
              to="/files-images"
              className="text-xl font-semibold text-indigo-700 hover:underline"
            >
              Files & Images
            </Link>
            <p className="mt-2 text-gray-700">
              Upload images to ask an LLM about, and have them automatically
              saved and tracked.
            </p>
          </li>
          <li className="border rounded p-4 hover:shadow transition">
            <Link
              to="/rag-basic"
              className="text-xl font-semibold text-indigo-700 hover:underline"
            >
              RAG Chat
            </Link>
            <p className="mt-2 text-gray-700">
              A simple RAG example with a chat interface.
            </p>
          </li>
          {/* rate limiting */}
          <li className="border rounded p-4 hover:shadow transition">
            <Link
              to="/rate-limiting"
              className="text-xl font-semibold text-indigo-700 hover:underline"
            >
              Rate Limiting
            </Link>
            <p className="mt-2 text-gray-700">
              Demonstrates rate limiting both message sending frequency and
              based on token usage.
            </p>
          </li>
          <li className="border rounded p-4 hover:shadow transition">
            <Link
              to="/weather-fashion"
              className="text-xl font-semibold text-indigo-700 hover:underline"
            >
              Tool Usage
            </Link>
            <p className="mt-2 text-gray-700">
              Demonstrates multi-step agent reasoning and tool use, via an
              example of a weather agent that uses a tool to get the weather and
              a fashion agent that uses a tool to get outfit suggestions based
              on the weather.
            </p>
          </li>
        </ul>
        <div className="mt-8 text-sm text-gray-500">
          More examples coming soon!
        </div>
      </div>
    </>
  );
}
