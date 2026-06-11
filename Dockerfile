FROM node:20-alpine AS base

# Installation des outils système de base au cas où
RUN apk add --no-cache libc6-compat

FROM base AS deps
WORKDIR /app

# On ne copie que le package.json (on ignore volontairement les lockfiles pnpm)
COPY package.json ./

# On utilise npm avec l'option legacy-peer-deps pour Next 16 et React 19
RUN npm install --legacy-peer-deps

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

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
