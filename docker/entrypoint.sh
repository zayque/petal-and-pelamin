#!/bin/sh
set -e

echo "▸ Applying database migrations…"
npx prisma migrate deploy

echo "▸ Seeding (safe to re-run)…"
npx prisma db seed || echo "  seed skipped"

echo "▸ Starting Petal & Pelamin on :3000"
exec node server.js
