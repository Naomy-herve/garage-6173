import { z } from "zod";
import { desc, eq } from "drizzle-orm";
import { ORPCError } from "@orpc/server";
import { base } from "../__core/app";
import { db } from "../database";
import * as schema from "../database/schema";
import { adminOnly } from "./admin";

export const orders = {
  create: base
    .input(
      z.object({
        productId: z.number().int(),
        quantity: z.number().int().min(1).max(999),
        customerName: z.string().trim().min(2).max(100),
        phone: z.string().trim().min(8).max(25),
        email: z.string().trim().email().max(150).or(z.literal("")).default(""),
        address: z.string().trim().max(300).default(""),
        message: z.string().trim().max(1000).default(""),
      }),
    )
    .handler(async ({ input }) => {
      const [p] = await db.select().from(schema.products).where(eq(schema.products.id, input.productId));
      if (!p) throw new ORPCError("NOT_FOUND", { message: "Produit introuvable" });
      const [row] = await db
        .insert(schema.orders)
        .values({
          productId: p.id,
          productName: p.name,
          unitPrice: p.price,
          quantity: input.quantity,
          customerName: input.customerName,
          phone: input.phone,
          email: input.email,
          address: input.address,
          message: input.message,
        })
        .returning();
      return { id: row.id };
    }),
  list: adminOnly.handler(() => db.select().from(schema.orders).orderBy(desc(schema.orders.id))),
  setStatus: adminOnly
    .input(z.object({ id: z.number().int(), status: z.enum(["nouvelle", "confirmee", "livree", "annulee"]) }))
    .handler(async ({ input }) => {
      await db.update(schema.orders).set({ status: input.status }).where(eq(schema.orders.id, input.id));
      return { ok: true };
    }),
  remove: adminOnly.input(z.object({ id: z.number().int() })).handler(async ({ input }) => {
    await db.delete(schema.orders).where(eq(schema.orders.id, input.id));
    return { ok: true };
  }),
};
