import type { ITtscLintConfig } from "@ttsc/lint";

import shared from "../../config/lint.config";

const config = {
  ...shared,
  ignores: [".next/**/*.ts"],
  rules: {
    ...shared.rules,
    "typescript/no-floating-promises": "off",
    "typescript/no-misused-promises": "off",
  },
} satisfies ITtscLintConfig;

export default config;
