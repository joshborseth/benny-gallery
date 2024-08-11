import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import * as schema from "./schema";

export const client = createClient({ url: "./db.sqlite" });

export const db = drizzle(client, { schema });
