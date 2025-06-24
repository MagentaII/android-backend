const Database = require("better-sqlite3");

// 建立或連接資料庫檔案（會自動產生 users.db）
// const db = new Database("users.db");
const db = new Database('file:memdb1?mode=memory&cache=shared');

// 建立 users 表格（如果還沒建立的話）
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  )
`
).run();

// 建立 auth_users 表格（如果還沒建立的話）
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS auth_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
    )
  `
).run();

// 建立 notes 表格（如果還沒建立的話）
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    title TEXT NOT NULL,
    content TEXT,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP
  )
`
).run();

module.exports = db;
