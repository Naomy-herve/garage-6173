import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

const now = () => new Date();

export const products = sqliteTable("products", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  brand: text("brand").notNull().default(""),
  image: text("image").notNull().default(""),
  price: integer("price").notNull().default(0), // Ariary
  detail: text("detail").notNull().default(""),
  usage: text("usage").notNull().default(""), // utilité
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(now),
});

export const orders = sqliteTable("orders", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  productId: integer("product_id"),
  productName: text("product_name").notNull(),
  unitPrice: integer("unit_price").notNull().default(0),
  quantity: integer("quantity").notNull().default(1),
  customerName: text("customer_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull().default(""),
  address: text("address").notNull().default(""),
  message: text("message").notNull().default(""),
  status: text("status").notNull().default("nouvelle"), // nouvelle | confirmee | livree | annulee
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(now),
});

export const comments = sqliteTable("comments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  productId: integer("product_id"),
  author: text("author").notNull(),
  rating: integer("rating").notNull().default(5),
  content: text("content").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(now),
});
