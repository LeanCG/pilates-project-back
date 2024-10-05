import mysql from "mysql"
import dotenv from "dotenv";

dotenv.config();

export const db = mysql.createConnection({
    host: process.env.HOST, 
    user: process.env.USER_DATABASE,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
})