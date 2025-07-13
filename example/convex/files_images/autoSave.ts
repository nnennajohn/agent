import { v } from "convex/values";
import { action } from "../_generated/server";
import { agent } from "../agents/simple";

/**
 * Ask about an image, passing up the image bytes and mime type.
 */
export const askAboutImage = action({
  args: {
    prompt: v.string(),
    image: v.bytes(),
    mimeType: v.string(),
  },
  handler: async (ctx, { prompt, image, mimeType }) => {
    const { thread } = await agent.createThread(ctx, {});
    const result = await thread.generateText({
      prompt,
      messages: [
        {
          role: "user",
          content: [
            // You can pass the data in directly. It will automatically store
            // it in file storage and pass around the URL.
            { type: "image", image, mimeType },
            { type: "text", text: prompt },
          ],
        },
      ],
    });
    return result.text;
  },
});

// TODO: show an example of using http action or file storage.
