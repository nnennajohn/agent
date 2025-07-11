import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import ragTables from "./rag/tables.js";

export default defineSchema({
  ...ragTables,

  /** TODO: delete these */
  ideas: defineTable({
    title: v.string(),
    summary: v.string(),
    lastUpdated: v.number(),
    mergedInto: v.optional(v.id("ideas")),
  })
    .index("by_lastUpdated", ["lastUpdated"])
    .searchIndex("title", {
      searchField: "title",
      filterFields: ["mergedInto"],
    })
    .searchIndex("summary", {
      searchField: "summary",
      filterFields: ["mergedInto"],
    }),

  // To support viewing older versions
  // oldIdeaVersions: defineTable({
  //   ideaId: v.id("ideas"),
  //   title: v.string(),
  //   summary: v.string(),
  //   version: v.number(),
  // })
  //   .index("by_idea_version", ["ideaId", "version"]),

  entries: defineTable({
    content: v.string(),
    ideaId: v.optional(v.id("ideas")),
  }).index("by_ideaId", ["ideaId"]),

  ideaTags: defineTable({
    ideaId: v.id("ideas"),
    tag: v.string(),
  })
    .index("by_ideaId", ["ideaId"])
    .index("by_tag", ["tag"]),

  relatedIdeas: defineTable({
    ideaId1: v.id("ideas"),
    ideaId2: v.id("ideas"),
  })
    .index("by_idea1", ["ideaId1"])
    .index("by_idea2", ["ideaId2"]),
});
