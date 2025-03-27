FROM ubuntu:22.04

# Установка Node.js
RUN apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs git && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Копируем сначала package.json
COPY package*.json ./

# Устанавливаем зависимости с несколькими попытками
RUN npm config set registry https://registry.npmmirror.com && \
    npm config set fetch-retries 5 && \
    npm config set fetch-retry-maxtimeout 60000 && \
    npm install

COPY . .

CMD ["node", "index.js"] 