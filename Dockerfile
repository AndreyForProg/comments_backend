FROM node:18.17.0

WORKDIR /app

# Настройка DNS Google
RUN echo "nameserver 8.8.8.8" > /etc/resolv.conf && \
    echo "nameserver 8.8.4.4" >> /etc/resolv.conf

# Копирование package.json
COPY package*.json ./

# Настройка npm с использованием прокси и DNS
RUN npm config set registry http://registry.npmjs.org/ && \
    npm config set strict-ssl false && \
    npm config set dns_cache_timeout 0 && \
    npm config set maxsockets 50 && \
    npm config set fetch-retries 5 && \
    npm config set fetch-retry-maxtimeout 60000 && \
    npm config set fetch-retry-mintimeout 10000 && \
    npm install --verbose

COPY . .

EXPOSE 3010

CMD ["npm", "start"] 