FROM node:18-alpine

# Установка переменных окружения для npm
ENV npm_config_registry=https://registry.npmmirror.com \
    npm_config_fetch_retries=5 \
    npm_config_fetch_retry_maxtimeout=60000 \
    npm_config_strict_ssl=false \
    npm_config_timeout=60000

WORKDIR /app

# Копируем только необходимые файлы
COPY package*.json ./

# Установка зависимостей с несколькими попытками и разными registry
RUN for i in 1 2 3 4 5; do \
        echo "Attempt $i: Installing dependencies..." && \
        npm install --no-package-lock --no-audit || \
        (npm config set registry https://registry.npm.taobao.org && npm install --no-package-lock --no-audit) || \
        (npm config set registry https://r.cnpmjs.org && npm install --no-package-lock --no-audit) || \
        continue && break; \
        echo "Attempt $i failed. Waiting before retry..." && \
        sleep 10; \
    done

# Копируем остальные файлы проекта
COPY . .

# Запускаем приложение
CMD ["node", "index.js"] 