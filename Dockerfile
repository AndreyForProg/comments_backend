FROM node:18-alpine

# Установка переменных окружения для DNS
ENV npm_config_registry=https://registry.npmmirror.com
ENV npm_config_fetch_retries=5
ENV npm_config_fetch_retry_maxtimeout=60000
ENV npm_config_strict_ssl=false

WORKDIR /app

# Установка git
RUN apk add --no-cache git

# Копируем package.json
COPY package*.json ./

# Установка зависимостей с несколькими попытками
RUN for i in 1 2 3 4 5; do \
        npm install && break || \
        echo "Retry attempt $i..." && \
        sleep 15 && \
        if [ $i -eq 1 ]; then npm config set registry https://registry.npm.taobao.org; fi && \
        if [ $i -eq 2 ]; then npm config set registry https://r.cnpmjs.org; fi; \
    done

COPY . .

CMD ["node", "index.js"] 