import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import ragTables from "./rag/tables.js";
import usageTables from "./usage_tracking/tables.js";

export default defineSchema({
  ...ragTables,
  ...usageTables,
});
