const db = require("../models/db");

//liking a post
exports.likePost = (req, res) => {
  const userId = req.user.id;
  const postId = parseInt(req.params.id);

  db.run(
    `INSERT OR REPLACE INTO post_reactions (userId, postId, type) VALUES (?, ?, 'like')`,
    [userId, postId],
    function (err) {
      if (err) return res.status(500).json({ error: "Failed to like" });
      res.json({ message: "Post liked" });
    }
  );
};

//disliking a post
exports.dislikePost = (req, res) => {
  const userId = req.user.id;
  const postId = parseInt(req.params.id);

  db.run(
    `INSERT OR REPLACE INTO post_reactions (userId, postId, type) VALUES (?, ?, 'dislike')`,
    [userId, postId],
    function (err) {
      if (err) return res.status(500).json({ error: "Failed to dislike" });
      res.json({ message: "Post disliked" });
    }
  );
};

//getting the total number of likes and dislikes
exports.getReactions = (req, res) => {
  const postId = parseInt(req.params.id);

  db.all(
    `SELECT type, COUNT(*) as count FROM post_reactions WHERE postId = ? GROUP BY type`,
    [postId],
    (err, rows) => {
      if (err)
        return res.status(500).json({ error: "Failed to get reactions" });

      const result = { likes: 0, dislikes: 0 };
      rows.forEach((row) => {
        if (row.type === "like") result.likes = row.count;
        if (row.type === "dislike") result.dislikes = row.count;
      });

      res.json(result);
    }
  );
};
