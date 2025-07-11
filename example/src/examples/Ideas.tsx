import { useState } from "react";
import { useAction, useQuery } from "convex/react";
import { usePaginatedQuery } from "convex-helpers/react";
import { api } from "../../convex/_generated/api";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";

export function IdeasPage() {
  const [content, setContent] = useState("");
  const submitThought = useAction(api.ideaAgents.submitRandomThought);
  const entries = usePaginatedQuery(
    api.ideas.listEntries,
    { ideaId: null },
    { initialNumItems: 50 },
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    console.log("submitting thought", content);
    void submitThought({
      userId: "123",
      entry: content,
    });
    setContent("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col gap-12">
        <div className="max-w-lg mx-auto w-full">
          <form onSubmit={handleSubmit}>
            <div className="relative">
              <textarea
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = e.target.scrollHeight + "px";
                }}
                onKeyDown={handleKeyDown}
                className="w-full min-h-[4rem] max-h-[70vh] p-4 pb-16 rounded-xl border-2 border-indigo-100 text-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-lg overflow-hidden"
                placeholder="Write your thoughts..."
              />
              <button
                type="submit"
                disabled={!content.trim()}
                className="absolute bottom-2 left-2 right-2 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium text-lg hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:hover:from-indigo-600 disabled:hover:to-purple-600 transition-all shadow-inner flex items-center justify-center gap-2"
              >
                <span>Capture Thought</span>
                {content.trim() && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                )}
              </button>
            </div>
          </form>
        </div>
        <InProgressMessages />

        <h2 className="text-2xl font-bold">Ideas</h2>
        <Ideas />

        <h2 className="text-2xl font-bold">Entries</h2>

        <div className="space-y-6">
          {entries.results.map((entry) => (
            <div
              key={"entry-" + entry._id}
              className="p-6 rounded-xl border border-indigo-100 shadow-sm"
            >
              <div className="prose prose-lg prose-indigo max-w-none prose-p:mt-2 prose-p:mb-2">
                <ReactMarkdown>{entry.content}</ReactMarkdown>
              </div>
              <div className="text-sm text-indigo-500/70 mt-4">
                {new Date(entry._creationTime).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function InProgressMessages() {
  const inProgressMessages = useQuery(api.ideaAgents.inProgressMessages, {
    userId: "123",
  });

  console.log(inProgressMessages);

  if (!inProgressMessages) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {inProgressMessages.map((message) => (
        <div key={"in-progress-" + message.id}>{message.text}</div>
      ))}
    </div>
  );
}

export function Ideas() {
  const {
    results: ideas,
    loadMore,
    status,
  } = usePaginatedQuery(api.ideas.listIdeas, {}, { initialNumItems: 12 });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ideas.map((idea) => (
          <Link
            key={"idea-" + idea._id}
            to={`/ideas/${idea._id}`}
            className="block p-6 rounded-lg border hover:border-indigo-500 transition-colors"
          >
            <h3 className="text-xl font-semibold mb-2">{idea.title}</h3>
            <div className="prose prose-sm prose-indigo max-w-none prose-p:mt-2 prose-p:mb-2">
              <ReactMarkdown>{idea.summary}</ReactMarkdown>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {idea.tags.map((tag) => (
                <span
                  key={"idea-" + idea._id + "-tag-" + tag}
                  className="px-2 py-1 bg-gray-100 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
      {status === "CanLoadMore" && (
        <button
          onClick={() => loadMore(12)}
          className="mt-8 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Load More
        </button>
      )}
    </div>
  );
}
