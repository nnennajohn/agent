import { ActionCtx, QueryCtx } from "./_generated/server";

export async function getAuthUserId(_ctx: QueryCtx | ActionCtx) {
  return "test user";
}
