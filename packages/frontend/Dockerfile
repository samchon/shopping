FROM node:22-slim AS base
RUN corepack enable && corepack prepare pnpm@10.10.0 --activate
WORKDIR /app

# ---- deps ----
FROM base AS deps
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/api/package.json packages/api/
COPY packages/frontend/package.json packages/frontend/
RUN pnpm install --frozen-lockfile

# ---- build ----
FROM deps AS build
COPY packages/api/ packages/api/
COPY packages/frontend/ packages/frontend/
COPY prettier.config.js .prettierignore ./

# .env.example has all defaults; copy as .env.local for the Next.js build
RUN cp packages/frontend/.env.example packages/frontend/.env.local

RUN cd packages/api && pnpm run build:tsc
RUN cd packages/frontend && pnpm build

# ---- runtime ----
FROM base AS runtime
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/packages/api ./packages/api
COPY --from=build /app/packages/frontend ./packages/frontend
COPY --from=build /app/package.json /app/pnpm-workspace.yaml ./

WORKDIR /app/packages/frontend
EXPOSE 3000

CMD ["pnpm", "start"]
