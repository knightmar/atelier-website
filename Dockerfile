FROM node:20-alpine AS base

# 1. Installation des outils système nécessaires pour Alpine (Sharp, node-gyp, etc.)
RUN apk add --no-cache libc6-compat python3 make g++

# 2. Configuration de pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@latest --activate

FROM base AS deps
WORKDIR /app

# On copie TOUS les fichiers de configuration pnpm (très important pour les workspaces)
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./

# Si tu as d'autres packages internes définis dans ton workspace, décommente la ligne suivante :
# COPY packages/ ./packages/

# Installation sans exécuter les scripts de post-install qui font souvent planter Docker
RUN pnpm i --no-frozen-lockfile --ignore-scripts

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
