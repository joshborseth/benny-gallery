import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const media = sqliteTable("media", {
  id: integer("id").primaryKey().unique().notNull(),
  url: text("url").notNull(),
  createdAt: text("createdAt").notNull(),
  updatedAt: text("updatedAt").notNull(),
  type: text("type", { enum: ["video", "picture"] }).notNull(),
});
