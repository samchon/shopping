FROM node:22-slim AS base
RUN corepack enable && corepack prepare pnpm@10.10.0 --activate
WORKDIR /app

# ---- deps ----
FROM base AS deps
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/api/package.json packages/api/
COPY packages/backend/package.json packages/backend/
RUN pnpm install --frozen-lockfile

# ---- build ----
FROM deps AS build
COPY packages/api/ packages/api/
COPY packages/backend/ packages/backend/
COPY prettier.config.js .prettierignore ./
RUN cd packages/backend && pnpm run build

# ---- runtime ----
FROM base AS runtime
RUN apt-get update && apt-get install -y --no-install-recommends postgresql-client && rm -rf /var/lib/apt/lists/*
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/packages/api ./packages/api
COPY --from=build /app/packages/backend ./packages/backend
COPY --from=build /app/package.json /app/pnpm-workspace.yaml ./

WORKDIR /app/packages/backend
# .env.local has all defaults; build/env.ts copies it to .env at runtime
EXPOSE 37001

COPY packages/backend/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["pnpm", "start:ts"]
