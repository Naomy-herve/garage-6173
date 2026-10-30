import { z } from "zod";
import { desc, eq } from "drizzle-orm";
import { ORPCError } from "@orpc/server";
import { base } from "../__core/app";
import { db } from "../database";
import * as schema from "../database/schema";
import { adminOnly } from "./admin";

const productInput = z.object({
  name: z.string().trim().min(1).max(150),
  brand: z.string().trim().max(80).default(""),
  image: z.string().trim().max(500).default(""),
  price: z.number().int().min(0).max(1_000_000_000),
  detail: z.string().trim().max(3000).default(""),
  usage: z.string().trim().max(1500).default(""),
});

export const products = {
  list: base.handler(() =>
    db.select().from(schema.products).orderBy(desc(schema.products.id)),
  ),
  create: adminOnly.input(productInput).handler(async ({ input }) => {
    const [row] = await db.insert(schema.products).values(input).returning();
    return row;
  }),
  update: adminOnly
    .input(productInput.extend({ id: z.number().int() }))
    .handler(async ({ input }) => {
      const { id, ...values } = input;
      const [row] = await db.update(schema.products).set(values).where(eq(schema.products.id, id)).returning();
      if (!row) throw new ORPCError("NOT_FOUND", { message: "Produit introuvable" });
      return row;
    }),
  remove: adminOnly.input(z.object({ id: z.number().int() })).handler(async ({ input }) => {
    await db.delete(schema.comments).where(eq(schema.comments.productId, input.id));
    await db.delete(schema.products).where(eq(schema.products.id, input.id));
    return { ok: true };
  }),
};
