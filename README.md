# comments_backend

express, graphq, sequelize, pg
npx sequelize-cli model:generate --name User --attributes nickname:string,email:string
npx sequelize-cli db:migrate
npx sequelize-cli db:migrate:undo
npx sequelize-cli db:migrate:undo:all
npx sequelize-cli db:seed
npx sequelize-cli db:seed:undo
npx sequelize-cli db:seed:undo:all
