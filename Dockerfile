FROM node:18.17.0

WORKDIR /app

# Копирование package.json
COPY package*.json ./

# Установка зависимостей с использованием нескольких зеркал
RUN npm config set registry https://registry.npmjs.org/ \
    && npm config set strict-ssl false \
    && npm install || \
    npm install --registry=https://r.cnpmjs.org/ || \
    npm install --registry=https://skimdb.npmjs.com/registry/

COPY . .

# Использование node напрямую вместо npm start
CMD ["node", "index.js"] 