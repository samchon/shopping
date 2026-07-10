import type { ITtscLintConfig } from "@ttsc/lint";

export default {
  extends: "../../config/lint.config.ts",
  ignores: ["src/prisma/**/*.ts"],
} satisfies ITtscLintConfig;
