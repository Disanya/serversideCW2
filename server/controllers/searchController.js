const db = require("../models/db");

//searching posts based on the country name
exports.searchByCountry = async (req, res) => {
  const { country } = req.params;

  db.all(
    `SELECT posts.*, users.email as author FROM posts JOIN users ON users.id = posts.userId WHERE posts.country LIKE ?`,
    [`%${country}%`],
    (err, rows) => {
      if (err)
        return res
          .status(500)
          .json({ error: "Failed to search by the country" });
      res.json({ rows });
    }
  );
};

//searching based on the username
exports.searchByUser = async (req, res) => {
  const { username } = req.params;

  db.all(
    `SELECT posts.*, users.username as author, -- Changed to username for consistency COALESCE(SUM(CASE WHEN r.type = 'like' THEN 1 ELSE 0 END), 0) AS likes, -- Added likes count
    COALESCE(SUM(CASE WHEN r.type = 'dislike' THEN 1 ELSE 0 END), 0) AS dislikes -- Added dislikes count FROM posts JOIN users ON users.id = posts.userId
    LEFT JOIN post_reactions r ON posts.id = r.postId -- Join for reactions WHERE users.username LIKE ? OR users.email LIKE ? -- Search both username and email
    GROUP BY posts.id`,
    [`%${username}%`, `%${username}%`],
    (err, rows) => {
      if (err)
        return res
          .status(500)
          .json({ error: "Failed to search by the username" });
      res.json({ rows });
    }
  );
};

//sorting the posts based on the newest , most liked and most disliked
exports.sortPosts = async (req, res) => {
  const { type } = req.params;

  let orderField = "p.date DESC";
  if (type === "liked") orderField = "likes DESC";
  else if (type === "disliked") orderField = "dislikes DESC";

  db.all(
    `SELECT p.*, u.username AS author, -- Ensure username is used for consistency COALESCE(SUM(CASE WHEN r.type = 'like' THEN 1 ELSE 0 END), 0) AS likes,
    COALESCE(SUM(CASE WHEN r.type = 'dislike' THEN 1 ELSE 0 END), 0) AS dislikes FROM posts p JOIN users u ON p.userId = u.id LEFT JOIN post_reactions r ON p.id = r.postId
    GROUP BY p.id ORDER BY ${orderField}`,
    [],
    (err, rows) => {
      if (err)
        return res.status(500).json({ error: "Failed to sort the posts" });
      res.json({ rows });
    }
  );
};
