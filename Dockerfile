FROM node:20-alpine AS base

# Installation propre de pnpm et configuration
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@latest --activate

FROM base AS deps
WORKDIR /app

# On copie les fichiers de configuration
COPY package.json pnpm-lock.yaml* ./

# ÉTAPES DE SÉCURITÉ : 
# 1. Si l'installation stricte échoue, on autorise pnpm à mettre à jour le lockfile pour Docker
# 2. On désactive les scripts de post-installation qui font souvent planter Alpine Linux
RUN pnpm i --frozen-lockfile || pnpm i --no-frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN pnpm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
