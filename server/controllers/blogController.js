const db = require("../models/db");

//creating a new post
exports.createPost = (req, res) => {
  const { title, content, country, date } = req.body;
  const userId = req.user.id;

  db.run(
    `INSERT INTO posts (title, content, country, date, userId) VALUES (?, ?, ?, ?, ?)`,
    [title, content, country, date, userId],
    function (err) {
      if (err)
        return res.status(500).json({ error: "Failed to create a new post" });
      res.json({ id: this.lastID });
    }
  );
};


//updating a past post
exports.updatePost = (req, res) => {
  const { title, content, country, date } = req.body;
  const id = req.params.id;
  const userId = req.user.id;

  db.run(
    `UPDATE posts SET title = ?, content = ?, country = ?, date = ? WHERE id = ? AND userId = ? `,
    [title, content, country, date, id, userId],
    function (err) {
      if (err || this.changes === 0)
        return res.status(403).json({ error: "Not Allowed" });
      res.json({ message: "Post updated" });
    }
  );
};

//deleting one of the user's posts
exports.deletePost = (req, res) => {
  const id = req.params.id;
  const userId = req.user.id;

  db.run(
    `DELETE FROM posts WHERE id = ? AND userId = ?`,
    [id, userId],
    function (err) {
      if (err || this.changes === 0)
        return res.status(403).json({ error: "Not Allowed" });
      res.json({ message: "Post deleted" });
    }
  );
};

//retrieving all currently available posts
exports.getAllPosts = (req, res) => {
  db.all(
    `SELECT posts.*, users.username as author FROM posts JOIN users ON users.id = posts.userId`,
    (err, rows) => {
      if (err)
        return res.status(500).json({ error: "Error in fetching posts" });
      res.json(rows);
    }
  );
};

//retrieving one specific post from all
exports.getPost = (req, res) => {
  const postId = parseInt(req.params.id);
  db.get(
    `SELECT p.*, u.username as author FROM posts p JOIN users u ON p.userId = u.id WHERE p.id = ?`,
    [postId],
    (err, post) => {
      if (err || !post)
        return res.status(404).json({ error: "Post not found" });
      db.all(
        `SELECT type, COUNT(*) as count FROM post_reactions  WHERE postId = ? GROUP BY type`,
        [postId],
        (err, reactions) => {
          if (err)
            return res.status(500).json({ error: "Failed to get reactions" });
          post.likes = 0;
          post.dislikes = 0;

          reactions.forEach((row) => {
            if (row.type === "like") post.likes = row.count;
            if (row.type === "dislike") post.dislikes = row.count;
          });

          return res.json(post);
        }
      );
    }
  );
};
