FROM node:20-alpine AS base

# Configuration de pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@latest --activate

FROM base AS deps
WORKDIR /app

# On ne copie QUE ce qui est nécessaire pour installer les modules
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./

# CONFIGURATION CRITIQUE POUR NEXT 16 / REACT 19 :
# --no-frozen-lockfile : Permet à Docker de s'adapter si ton lockfile local a un micro-écart
# --ignore-scripts     : Évite les crashs des scripts tiers sur Alpine Linux
# config set auto-install-peers true : Force pnpm à installer automatiquement les dépendances paires manquantes
RUN pnpm config set auto-install-peers true && \
    pnpm i --no-frozen-lockfile --ignore-scripts

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
