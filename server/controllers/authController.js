const db = require("../models/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

//registering a new user to the website
exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  db.run(
    `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`,
    [username, email, hashed],
    function (err) {
      if (err)
        return res.status(400).json({ error: "Username already exists" });
      res.status(201).json({ id: this.lastID, username, email });
    }
  );
};

//r registered user is login to the website
exports.login = (req, res) => {
  const { username, password } = req.body;

  db.get(
    `SELECT * FROM users WHERE username = ?`,
    [username],
    async (err, user) => {
      if (err || !user)
        return res.status(401).json({ error: "Invalid user username" });

      const match = await bcrypt.compare(password, user.password);
      if (!match)
        return res.status(401).json({ error: "Invalid user password" });
      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7h" });
      res.json({
        token,
        id: user.id,
        username: user.username,
        email: user.email,
      });
    }
  );
};

//retrieving the public profile of a registered user
exports.getPublicProfile = (req, res) => {
  const { username } = req.params;

  db.get(
    "SELECT id, username, email FROM users WHERE username = ?",
    [username],
    (err, user) => {
      if (err || !user)
        return res.status(401).json({ error: "User not found" });

      db.all(
        `SELECT * FROM posts WHERE userId = ?`,
        [user.id],
        (err2, posts) => {
          if (err2)
            return res.status(500).json({ error: "Failed to load posts" });

          db.get(
            `SELECT COUNT(*) as followers FROM followers WHERE followingId = ?`,
            [user.id],
            (err3, count1) => {
              db.get(
                `SELECT COUNT(*) as following FROM followers WHERE followerId = ?`,
                [user.id],
                (err4, count2) => {
                  res.json({
                    user,
                    posts,
                    follwers: count1?.follwers || 0,
                    following: count2?.following || 0,
                  });
                }
              );
            }
          );
        }
      );
    }
  );
};

//resetting the password of a user acccount after forgetting
exports.forgotPassword = async (req, res) => {
  const { username, email, newpassword } = req.body;
  const hashed = await bcrypt.hash(newpassword, 10);

  db.run(
    `UPDATE users SET password = ? WHERE username = ? AND email = ?`,
    [hashed, username, email],
    function (err) {
      if (err || this.changes === 0)
        return res.status(400).json({ error: "Invalid credentials" });
      res.json({ message: "Password reset successfully" });
    }
  );
};
