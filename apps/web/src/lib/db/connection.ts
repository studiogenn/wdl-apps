import postgres from "postgres";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}

export const sql = postgres(connectionString, {
  prepare: false, // required for PgBouncer transaction mode
  max: 5,
  idle_timeout: 20,
  connect_timeout: 10,
  ssl: "require",
});
