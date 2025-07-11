import { useParams } from "react-router-dom";
import { usePaginatedQuery, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
import { Id } from "../../convex/_generated/dataModel";

export function IdeaDetail() {
  const { id } = useParams<{ id: Id<"ideas"> }>();
  if (!id) throw new Error("No idea id");
  const idea = useQuery(api.ideas.getIdea, { id });
  const entries = usePaginatedQuery(
    api.ideas.listEntries,
    { ideaId: id },
    { initialNumItems: 50 },
  );

  if (!idea) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{idea.title}</h1>
        <div className="flex flex-wrap gap-2 mb-4">
          {idea.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-gray-100 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="prose">
          <ReactMarkdown>{idea.summary}</ReactMarkdown>
        </div>
      </div>

      {idea.related.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Related Ideas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {idea.related.map((related) => (
              <Link
                key={related._id}
                to={`/idea/${related._id}`}
                className="p-4 rounded-lg border hover:border-indigo-500"
              >
                <h3 className="font-semibold">{related.title}</h3>
                <div className="prose line-clamp-2">
                  <ReactMarkdown>{related.summary}</ReactMarkdown>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold mb-4">Entries</h2>
        <div className="space-y-4">
          {entries.results.map((entry) => (
            <div key={entry._id} className="p-4 rounded-lg border">
              <div className="prose">
                <ReactMarkdown>{entry.content}</ReactMarkdown>
              </div>
              <div className="text-sm text-gray-500 mt-2">
                {new Date(entry._creationTime).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
