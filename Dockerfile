# syntax = docker/dockerfile:1.6

############################
# 1) Instala dependências
############################
FROM node:20-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json* ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci

############################
# 2) Build
############################
FROM node:20-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Garante que o TS seja usado no build
RUN npm run build

############################
# 3) Runner (produção)
############################
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# Copia apenas os arquivos necessários para rodar standalone

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

# O entrypoint correto é o server.js dentro do standalone
CMD ["node", "server.js"]
