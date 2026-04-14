FROM node:22-slim AS base
RUN corepack enable && corepack prepare pnpm@10.10.0 --activate
WORKDIR /app

# ---- deps ----
FROM base AS deps
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/api/package.json packages/api/
COPY packages/backend/package.json packages/backend/
COPY packages/frontend/package.json packages/frontend/
RUN pnpm install --frozen-lockfile

# ---- build ----
FROM deps AS build
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY prettier.config.js .prettierignore ./
COPY packages/api/ packages/api/
COPY packages/backend/ packages/backend/
COPY packages/frontend/ packages/frontend/

RUN cp packages/frontend/.env.example packages/frontend/.env.local
RUN pnpm --filter @samchon/shopping-backend build:sdk
RUN pnpm --filter @samchon/shopping-frontend build

# ---- runtime ----
FROM base AS runtime
RUN apt-get update && apt-get install -y --no-install-recommends postgresql-client && rm -rf /var/lib/apt/lists/*
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json /app/pnpm-workspace.yaml /app/pnpm-lock.yaml ./
COPY --from=build /app/packages ./packages
COPY scripts/start-fullstack.sh /app/scripts/start-fullstack.sh

RUN chmod +x /app/scripts/start-fullstack.sh

WORKDIR /app
EXPOSE 3000 37001

CMD ["/app/scripts/start-fullstack.sh"]
