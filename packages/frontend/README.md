# `@samchon/shopping-frontend`
[![Guide Documents](https://img.shields.io/badge/guide-documents-forestgreen)](./wiki/README.md)

Frontend package of the [`@samchon/shopping`](https://github.com/samchon/shopping) monorepo — a Next.js storefront built on the auto-generated SDK (`@samchon/shopping-api`).

This package was built **entirely by AI** Starting from an empty directory, Claude Code read only the SDK source code and a single [`CLAUDE.md`](./CLAUDE.md) prompt file, then produced every package, component, page, and test on its own. No human wrote any frontend code or configured any tooling.

The point is not that AI can always build a perfect storefront. The point is that when the backend invests in proper API design, typed DTOs, and thorough documentation (via [Nestia](https://nestia.io)), the frontend becomes something AI can handle without human intervention.

For setup instructions, screenshots, and the full stack overview, see the [root README](../../README.md).

## Commands
```bash
pnpm dev              # start dev server
pnpm build            # production build
pnpm start            # serve production build
pnpm check            # typecheck + lint
pnpm test:e2e         # Playwright tests (simulation mode, no backend needed)
pnpm ui:review        # screenshot review at multiple viewports
pnpm readme:screens   # refresh README screenshots (requires backend)
```
