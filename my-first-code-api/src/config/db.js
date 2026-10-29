import mysql from "mysql2/promise";
import { config } from "./env.js";
import logger from "./logger.js";

const pool = mysql.createPool({
  host: "69.62.84.113",
  user:"root",
  password: "vwt2025",
  database: "myFirstCode_db",
  port: "3306",
  waitForConnections: true,
  connectionLimit: 100, 
  queueLimit: 0,
});
console.log(process.env.DB_HOST)

pool.getConnection()
  .then(() => logger.info("MySQL Database Connected"))
  .catch((err) => logger.error("Database Connection Failed", err));

export default pool;
