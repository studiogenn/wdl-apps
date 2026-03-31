import postgres from "postgres";

let _sql: ReturnType<typeof postgres> | null = null;

export function getsql() {
  if (_sql) return _sql;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  _sql = postgres(connectionString, {
    prepare: false, // required for PgBouncer transaction mode
    max: 5,
    idle_timeout: 20,
    connect_timeout: 10,
    ssl: "require",
  });

  return _sql;
}
