FROM node:18.17.0

WORKDIR /app

# Установка pnpm
RUN npm install -g pnpm

# Копирование package.json
COPY package*.json ./

# Настройка и установка зависимостей через pnpm
RUN pnpm config set registry https://registry.npmjs.org/ \
    && pnpm config set strict-ssl false \
    && pnpm config set network-concurrency 1 \
    && pnpm config set network-timeout 300000 \
    && pnpm install --no-frozen-lockfile \
    || pnpm install --registry=https://registry.npmmirror.com \
    || pnpm install --registry=https://r.cnpmjs.org/

COPY . .

# Запуск через pnpm
CMD ["pnpm", "start"] 