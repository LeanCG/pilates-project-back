import mysql from "mysql"

export const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "L34ndr0.040",
    database: "pilates"
})