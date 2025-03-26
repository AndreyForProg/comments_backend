# Comments App

Серверная часть приложения для создания и управления древовидными комментариями с поддержкой загрузки файлов и полнотекстового поиска.

## Функциональность

- 📝 Создание комментариев с поддержкой вложенности
- 🔍 Полнотекстовый поиск по комментариям
- 📎 Загрузка файлов (изображения: JPG, PNG, GIF и текстовые файлы: TXT)
- 🖼️ Автоматическое изменение размера изображений (макс. 320x240)
- 📄 Ограничение размера текстовых файлов (макс. 100KB)
- 🗑️ Удаление комментариев с вложенными комментариями
- ⚡ Elasticsearch для быстрого поиска
- 🔄 Сортировка комментариев по различным параметрам

## Технологии

- Node.js
- Express
- GraphQL (Apollo Server)
- Sequelize (PostgreSQL)
- Elasticsearch
- Sharp (для обработки изображений)

## Установка и запуск

1. Клонируйте репозиторий:

git clone <url-репозитория>

2. Установите зависимости:

npm install

3. Запустите Docker-контейнеры для PostgreSQL и Elasticsearch:

docker-compose up -d

4. Запустите сервер:

# Для разработки

npm run dev

# Для продакшена

npm start

5. Схему бд можно посмотреть в файле `comment_schema.mwb`

## API GraphQL

### Queries

```graphql
# Получение комментариев
getComments(
  limit: Int,
  offset: Int,
  orderBy: String,
  order: String
): CommentsResponse

# Поиск комментариев
searchComments(
  query: String!,
  limit: Int,
  offset: Int
): SearchCommentsResponse
```

### Mutations

```graphql
# Создание комментария
createComment(
  text: String!
  email: String!
  nickname: String!
  parentId: ID
  homePage: String
  file: Upload
): Comment

# Удаление комментария
deleteComment(id: ID!): Boolean
```

## GraphQL Playground

Вы можете исследовать API и тестировать запросы через GraphQL Playground, доступный по адресу:
http://localhost:3010/graphql

## Ограничения

- Максимальный размер изображения: 320x240 пикселей
- Поддерживаемые форматы изображений: JPG, PNG, GIF
- Максимальный размер текстового файла: 100KB
- Поддерживаемый формат текстовых файлов: TXT

## Автор

Андрей Погорельченко
