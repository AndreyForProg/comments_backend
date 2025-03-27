# Первый этап - установка зависимостей
FROM node:18-alpine AS deps

# Установка git
RUN apk add --no-cache git

WORKDIR /app

# Копирование package.json
COPY package*.json ./

# Установка зависимостей через несколько разных источников
RUN npm config set registry https://registry.npm.taobao.org && \
    npm config set strict-ssl false && \
    npm config set fetch-retries 3 && \
    npm install || \
    (npm config set registry https://r.cnpmjs.org && npm install) || \
    (npm config set registry=https://registry.npmmirror.com && npm install)

# Второй этап - финальный образ
FROM node:18-alpine

WORKDIR /app

# Копируем установленные зависимости и исходный код
COPY --from=deps /app/node_modules ./node_modules
COPY . .

CMD ["node", "index.js"] 