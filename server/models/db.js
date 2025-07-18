const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./travelTales.db");

db.serialize(() => {
  //users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    password TEXT
  )`);

  //posts table
  db.run(`CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    content TEXT,
    country TEXT,
    date TEXT,
    userId INTEGER,
    FOREIGN KEY(userId) REFERENCES users(id)
  )`);

  //followers table
  db.run(`CREATE TABLE IF NOT EXISTS followers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    followerId INTEGER,
    followingId INTEGER,
    FOREIGN KEY(followerId) REFERENCES users(id),
    FOREIGN KEY(followingId) REFERENCES users(id)
  )`);

  //post reaction table
  db.run(`CREATE TABLE IF NOT EXISTS post_reactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    postId INTEGER,
    type TEXT CHECK(type IN ('like', 'dislike')),
    UNIQUE(userId, postId),
    FOREIGN KEY(userId) REFERENCES users(id),
    FOREIGN KEY(postId) REFERENCES posts(id)
  )`);
});

module.exports = db;
