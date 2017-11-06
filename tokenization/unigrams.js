
// 不管怎樣，先連上資料庫吧
var DATABASE_CONFIG = {
    host: "localhost",
    database: 'pc_pudding_2011_kals',
    username: 'kals',
    password: 'password'
};

const Sequelize = require('sequelize');
const sequelize = new Sequelize(DATABASE_CONFIG['database']
    , DATABASE_CONFIG['username']
    , DATABASE_CONFIG['password'], {
  host: DATABASE_CONFIG['host'],
  dialect: 'postgres',
});

console.log("test");