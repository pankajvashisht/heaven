require("dotenv").config();
const database = {
  default: process.env.DATABASETYPE || "mysql",
  mysql: {
    host: process.env.HOST || "localhost",
    user: process.env.USERNAME || "user",
    password: process.env.PASSWORD || "root@admin",
    database: process.env.DATABASE || "heaven",
    connectionLimit: 50
  },
  url: "",
};

module.exports = database;
