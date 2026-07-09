import type { ITtscLintConfig } from "@ttsc/lint";

export default async () => {
  const base = (await import("@samchon/shopping-config/lint.config.ts"))
    .default;
  return {
    ...base,
    ignores: [".next/**/*.ts", ".next/**/*.tsx", "next-env.d.ts"],
    rules: {
      ...base.rules,

      // Next.js: framework-specific runtime and performance traps.
      "nextjs/google-font-display": "error",
      "nextjs/google-font-preconnect": "error",
      "nextjs/inline-script-id": "error",
      "nextjs/next-script-for-ga": "error",
      "nextjs/no-assign-module-variable": "error",
      "nextjs/no-async-client-component": "error",
      "nextjs/no-before-interactive-script-outside-document": "error",
      "nextjs/no-css-tags": "error",
      "nextjs/no-document-import-in-page": "error",
      "nextjs/no-duplicate-head": "error",
      "nextjs/no-head-element": "error",
      "nextjs/no-head-import-in-document": "error",
      "nextjs/no-html-link-for-pages": "error",
      "nextjs/no-img-element": "error",
      "nextjs/no-page-custom-font": "error",
      "nextjs/no-script-component-in-head": "error",
      "nextjs/no-styled-jsx-in-document": "error",
      "nextjs/no-sync-scripts": "error",
      "nextjs/no-title-in-document-head": "error",
      "nextjs/no-typos": "error",
      "nextjs/no-unwanted-polyfillio": "error",

      // TanStack Query: cache key, callback ordering, and stable-client rules.
      "tanstack-query/exhaustive-deps": "error",
      "tanstack-query/infinite-query-property-order": "error",
      "tanstack-query/mutation-property-order": "error",
      "tanstack-query/no-rest-destructuring": "error",
      "tanstack-query/no-unstable-deps": "error",
      "tanstack-query/no-void-query-fn": "error",
      "tanstack-query/stable-query-client": "error",

      // React and Hooks: component/runtime correctness for TSX sources.
      "react/display-name": "error",
      "react/exhaustive-deps": "error",
      "react/jsx-no-useless-fragment": "error",
      "react/no-danger-with-children": "error",
      "react/rules-of-hooks": "error",
      "react/use-memo": "error",

      // JSX accessibility: static ARIA, label, keyboard, and semantic checks.
      "jsx-a11y/alt-text": "error",
      "jsx-a11y/anchor-has-content": "error",
      "jsx-a11y/anchor-is-valid": "error",
      "jsx-a11y/aria-props": "error",
      "jsx-a11y/aria-proptypes": "error",
      "jsx-a11y/aria-role": "error",
      "jsx-a11y/aria-unsupported-elements": "error",
      "jsx-a11y/heading-has-content": "error",
      "jsx-a11y/html-has-lang": "error",
      "jsx-a11y/iframe-has-title": "error",
      "jsx-a11y/img-redundant-alt": "error",
      "jsx-a11y/label-has-associated-control": "error",
      "jsx-a11y/lang": "error",
      "jsx-a11y/no-access-key": "error",
      "jsx-a11y/no-autofocus": "error",
      "jsx-a11y/no-distracting-elements": "error",
      "jsx-a11y/no-aria-hidden-on-focusable": "error",
      "jsx-a11y/no-redundant-roles": "error",
      "jsx-a11y/role-has-required-aria-props": "error",
      "jsx-a11y/role-supports-aria-props": "error",
      "jsx-a11y/scope": "error",
      "jsx-a11y/tabindex-no-positive": "error",

      // Playwright: e2e test correctness rules for frontend tests.
      "playwright/expect-expect": "error",
      "playwright/no-conditional-expect": "error",
      "playwright/no-duplicate-hooks": "error",
      "playwright/no-duplicate-slow": "error",
      "playwright/no-element-handle": "error",
      "playwright/no-eval": "error",
      "playwright/no-focused-test": "error",
      "playwright/no-force-option": "error",
      "playwright/no-networkidle": "error",
      "playwright/no-page-pause": "error",
      "playwright/no-skipped-test": "error",
      "playwright/no-standalone-expect": "error",
      "playwright/no-wait-for-navigation": "error",
      "playwright/no-wait-for-selector": "error",
      "playwright/no-wait-for-timeout": "error",
      "playwright/prefer-to-have-count": "error",
      "playwright/prefer-web-first-assertions": "error",
      "playwright/valid-describe-callback": "error",
      "playwright/valid-expect": "error",
      "playwright/valid-title": "error",
    },
  } satisfies ITtscLintConfig;
};
