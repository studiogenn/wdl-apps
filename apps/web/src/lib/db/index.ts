import { drizzle } from "drizzle-orm/postgres-js";
import { getsql } from "./connection";
import * as schema from "./schema";

let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb() {
  if (_db) return _db;
  _db = drizzle(getsql(), { schema });
  return _db;
}

export { schema };
