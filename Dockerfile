FROM node:18.17.0

# Настройка DNS Google
RUN echo "nameserver 8.8.8.8" > /etc/resolv.conf.override && \
    echo "nameserver 8.8.4.4" >> /etc/resolv.conf.override && \
    cp /etc/resolv.conf.override /etc/resolv.conf

WORKDIR /app

# Копирование package.json
COPY package*.json ./

# Базовая установка с повторными попытками
RUN for i in 1 2 3 4 5; do \
        npm install && break || \
        echo "Retry attempt $i..." && \
        sleep 10; \
    done

COPY . .

CMD ["node", "index.js"] 