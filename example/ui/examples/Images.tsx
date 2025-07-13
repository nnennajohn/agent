import { useAction } from "convex/react";
import { useState } from "react";
import { api } from "../../convex/_generated/api";

export function Images() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const askAboutImage = useAction(api.example.askAboutImage);
  return (
    <div className="flex flex-col gap-2 max-w-2xl mx-auto">
      <input
        type="text"
        className="border border-gray-300 rounded-md p-2"
        value={prompt}
        placeholder="What do you want to ask about the image?"
        onChange={(e) => setPrompt(e.target.value)}
      />
      <input
        type="file"
        onChange={(e) => setImage(e.target.files?.[0] ?? null)}
      />
      <button
        className="bg-blue-500 text-white rounded-md p-2"
        disabled={!prompt || !image}
        onClick={() => {
          if (!image) return;
          void image.arrayBuffer().then((data) => {
            void askAboutImage({
              prompt,
              image: data,
              mimeType: image.type,
            }).then((result) => {
              setResult(result);
            });
          });
        }}
      >
        Ask
      </button>
      {result && <div>{result}</div>}
    </div>
  );
}
