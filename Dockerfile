FROM node:18.17.0

WORKDIR /app

# Копирование package.json
COPY package*.json ./

# Использование только китайского зеркала npm
RUN npm config set registry https://registry.npmmirror.com \
    && npm config set strict-ssl false \
    && npm config set maxsockets 25 \
    && npm config set fetch-retries 5 \
    && npm config set fetch-retry-maxtimeout 60000 \
    && npm config set fetch-retry-mintimeout 10000 \
    && npm install --verbose

COPY . .

EXPOSE 3010

CMD ["npm", "start"] 