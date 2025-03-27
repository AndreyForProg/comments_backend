FROM registry.npmmirror.com/node:18.17.0

WORKDIR /app

# Копируем сначала package.json
COPY package*.json ./

# Устанавливаем зависимости используя китайское зеркало npm
RUN npm install --registry=https://registry.npmmirror.com \
    --network-timeout=100000 \
    --fetch-retries=5 \
    --fetch-retry-factor=2 \
    --fetch-retry-mintimeout=20000 \
    --fetch-retry-maxtimeout=120000

COPY . .

CMD ["node", "index.js"] 