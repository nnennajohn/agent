import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval(
  "deleteUnusedFiles",
  { hours: 1 },
  internal.files.vacuum.deleteUnusedFiles,
  {},
);

export default crons;
