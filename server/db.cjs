// server/db.cjs
const path = require("path");
const Database = require("better-sqlite3");

const dbPath = path.join(__dirname, "mindcare.db");
console.log("[DB] Iniciando SQLite em:", dbPath);

const db = new Database(dbPath);

// melhora consistência
db.pragma("journal_mode = WAL");

// cria tabela se não existir
db.exec(`
  CREATE TABLE IF NOT EXISTS quiz_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    score INTEGER NOT NULL,
    level TEXT NOT NULL,
    answers_json TEXT,     
    risk_profile TEXT,      
    created_at TEXT NOT NULL
  );
`);


const tables = db
  .prepare("SELECT name FROM sqlite_master WHERE type = 'table'")
  .all();

console.log("[DB] Tabelas encontradas:", tables);

module.exports = db;
