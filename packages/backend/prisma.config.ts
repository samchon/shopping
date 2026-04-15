import path from "path";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema",
  datasource: {
    url: `file:${path.resolve(__dirname, "prisma", "db.sqlite")}`,
  },
});
