FROM node:18.17.0

WORKDIR /app

# Установка cnpm
RUN npm install -g cnpm --registry=https://registry.npmmirror.com

COPY package*.json ./

# Установка зависимостей через cnpm
RUN cnpm install

COPY . .

CMD ["npm", "start"] 