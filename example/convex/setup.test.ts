/// <reference types="vite/client" />
import { test } from "vitest";
import { convexTest } from "convex-test";
import schema from "./schema.js";
export const modules = import.meta.glob("./**/*.*s");

// Sorry about everything
import componentSchema from "../node_modules/@convex-dev/agent/src/component/schema.js";
export { componentSchema };
export const componentModules = import.meta.glob(
  "../node_modules/@convex-dev/agent/src/component/**/*.ts",
);
import rateLimiterSchema from "../node_modules/@convex-dev/rate-limiter/src/component/schema.js";
const rateLimiterModules = import.meta.glob(
  "../node_modules/@convex-dev/rate-limiter/src/component/**/*.ts",
);

export function initConvexTest() {
  const t = convexTest(schema, modules);
  t.registerComponent("agent", componentSchema, componentModules);
  t.registerComponent("rateLimiter", rateLimiterSchema, rateLimiterModules);
  return t;
}

test("setup", () => {});
