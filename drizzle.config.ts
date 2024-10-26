import { type Config } from "drizzle-kit";

import { env } from "~/env";

export default {
  schema: "./src/server/db/schema.ts",
  dialect: "postgresql",
  schemaFilter:"finance_project",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
} satisfies Config;
