FROM node:18-alpine

# Настройка DNS для Alpine
RUN echo "nameserver 1.1.1.1" > /etc/resolv.conf && \
    echo "nameserver 8.8.8.8" >> /etc/resolv.conf

WORKDIR /app

# Установка git
RUN apk add --no-cache git

# Копируем package.json
COPY package*.json ./

# Настройка npm и установка зависимостей
RUN npm config set registry https://registry.npmmirror.com && \
    npm config set fetch-retries 5 && \
    npm config set fetch-retry-maxtimeout 60000 && \
    npm config set strict-ssl false && \
    npm install || \
    (npm config set registry https://registry.npm.taobao.org && npm install) || \
    (npm config set registry https://r.cnpmjs.org && npm install)

COPY . .

CMD ["node", "index.js"] 