import type { ITtscLintConfig } from "@ttsc/lint";

export default async () => {
  const base = (await import("@samchon/shopping-config/lint.config.ts"))
    .default;
  return {
    ...base,
    ignores: ["src/functional/**/*.ts"],
  } satisfies ITtscLintConfig;
};
