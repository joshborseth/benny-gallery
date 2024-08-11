//TODO: update all of this for
import { Client, createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import * as schema from "./schema";

const globalForDb = globalThis as unknown as {
  client: Client | undefined;
};

export const client = globalForDb.client ?? createClient({ url: "file:./db.sqlite" });

globalForDb.client = client;

export const db = drizzle(client, { schema });
