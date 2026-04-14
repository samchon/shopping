FROM node:22-slim

RUN corepack enable && corepack prepare pnpm@10.10.0 --activate
RUN apt-get update && apt-get install -y --no-install-recommends postgresql postgresql-contrib && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY . .

RUN pnpm install --frozen-lockfile
RUN cp packages/frontend/.env.example packages/frontend/.env.local
RUN pnpm --filter @samchon/shopping-frontend build

EXPOSE 3000 37001

CMD bash -lc "service postgresql start && su postgres -c \"psql -c \\\"ALTER USER postgres WITH PASSWORD 'root';\\\"\" && exec pnpm start"
