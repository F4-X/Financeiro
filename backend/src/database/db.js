import fs from "fs";
import { PGlite } from "@electric-sql/pglite";

if (!fs.existsSync("./data")) {
  fs.mkdirSync("./data");
}

export const db = new PGlite("./data/financas");