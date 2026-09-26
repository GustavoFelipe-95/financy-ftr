# --- Base stage: common dependencies ---
FROM node:22-alpine AS base
WORKDIR /app
# Native build tools required to compile better-sqlite3 from source
RUN apk add --no-cache python3 make g++
COPY package.json package-lock.json ./
RUN npm ci

# --- Build stage: compile TypeScript ---
FROM base AS build
COPY . .
# prisma generate only needs DATABASE_URL to be defined, not reachable
ENV DATABASE_URL="file:./database/dev.db"
RUN npm run prisma:generate
RUN npm run build

# --- Runtime stage ---
FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

RUN apk add --no-cache python3 make g++
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma.config.ts ./prisma.config.ts
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/node_modules/@prisma ./node_modules/@prisma
# prisma CLI is a devDependency; copy it so `migrate deploy` works at runtime
COPY --from=build /app/node_modules/prisma ./node_modules/prisma
COPY --from=build /app/node_modules/.bin/prisma ./node_modules/.bin/prisma

# Database file lives here; mount a volume to persist it across container restarts
RUN mkdir -p /app/database

EXPOSE 3001

# Applies existing migrations (non-interactive) then starts the server
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]
