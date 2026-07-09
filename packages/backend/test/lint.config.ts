import type { ITtscLintConfig } from "@ttsc/lint";

export default async () => {
  const base = (await import("@samchon/shopping-config/lint")).default;
  return {
    ...base,
  } satisfies ITtscLintConfig;
};
