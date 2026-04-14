#!/bin/bash
set -e

# Wait for PostgreSQL to be ready
until pg_isready -h "$SHOPPING_POSTGRES_HOST" -p "$SHOPPING_POSTGRES_PORT" -U postgres 2>/dev/null; do
  echo "Waiting for PostgreSQL..."
  sleep 1
done

# Create schema and seed data (default root credentials: postgres / root)
echo "Setting up database schema..."
pnpm schema 2>/dev/null || true

exec "$@"
