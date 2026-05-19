import pg from "pg";

const { Pool } = pg;

export const db = new Pool({
  host: "localhost",
  port: 5432,
  database: "financeiro",
  user: "financeiro_user",
  password: "F4chini_0312"
});