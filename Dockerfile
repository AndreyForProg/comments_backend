FROM node:18.17.0

WORKDIR /app

# Копирование package.json
COPY package*.json ./

# Настройка npm без изменения системных файлов
RUN npm config set registry http://registry.npmjs.org/ \
    && npm config set strict-ssl false \
    && npm config set dns_cache_timeout 0 \
    && npm config set maxsockets 50 \
    && npm config set fetch-retries 10 \
    && npm config set fetch-retry-maxtimeout 120000 \
    && npm config set fetch-retry-mintimeout 10000 \
    && npm config set network-timeout 600000 \
    && npm install --prefer-offline --no-audit --verbose

COPY . .

EXPOSE 3010

CMD ["npm", "start"] 