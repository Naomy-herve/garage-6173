import { z } from "zod";
import { desc, eq } from "drizzle-orm";
import { base } from "../__core/app";
import { db } from "../database";
import * as schema from "../database/schema";
import { adminOnly } from "./admin";

export const comments = {
  list: base.handler(() => db.select().from(schema.comments).orderBy(desc(schema.comments.id)).limit(200)),
  create: base
    .input(
      z.object({
        productId: z.number().int().nullable().default(null),
        author: z.string().trim().min(2).max(60),
        rating: z.number().int().min(1).max(5).default(5),
        content: z.string().trim().min(2).max(1000),
      }),
    )
    .handler(async ({ input }) => {
      const [row] = await db.insert(schema.comments).values(input).returning();
      return row;
    }),
  remove: adminOnly.input(z.object({ id: z.number().int() })).handler(async ({ input }) => {
    await db.delete(schema.comments).where(eq(schema.comments.id, input.id));
    return { ok: true };
  }),
};
