# =========================
# ESTÁGIO 1: BUILDER
# =========================
FROM node:20-alpine AS builder

WORKDIR /app

ENV CI=true

# Copia package.json e package-lock.json
COPY package*.json ./

# Instala dependências completas
RUN npm ci

# Copia o restante do código
COPY . .

# Se houver next.config.ts, precisamos do TypeScript aqui
RUN npm install typescript @types/node --save-dev

# Build
RUN npx tsc --noEmit && mkdir -p public && npm run build


# =========================
# ESTÁGIO 2: RUNNER (produção)
# =========================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=80
ENV HOSTNAME=0.0.0.0
ENV NXT_SHARP=true

# Copia package.json e package-lock.json
COPY package*.json ./

# Instala apenas dependências de produção
RUN npm ci --omit=dev

# Caso tenha next.config.ts, precisamos garantir que TypeScript está disponível
RUN npm install typescript @types/node

# Ajusta permissões
RUN chown -R node:node /app

# Copia artefatos de build do estágio anterior
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./  
COPY --from=builder /app/tsconfig.json ./   

# Instala libcap para permitir porta 80 sem root
RUN apk add --no-cache libcap \
    && setcap 'cap_net_bind_service=+ep' /usr/local/bin/node

# Troca para usuário não-root
USER node

# Expõe porta
EXPOSE 80

# Comando para rodar
CMD ["npm", "run", "start"]
