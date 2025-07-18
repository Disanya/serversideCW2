const db = require("../models/db");

//a user following another user's account
exports.followUser = (req, res) => {
  const followerId = req.user.id;
  const followingId = parseInt(req.params.id);

  if (followerId === followingId) {
    return res.status(400).json({ error: "You can not follow yourself" });
  }

  db.get(
    `SELECT * FROM followers WHERE followerId = ? AND followingId = ?`,
    [followerId, followingId],
    (err, row) => {
      if (row) return res.status(500).json({ error: "Already following" });

      db.run(
        `INSERT INTO followers (followerId, followingId) VALUES (?, ?)`,
        [followerId, followingId],
        (err, row) => {
          if (row) return res.status(500).json({ error: "Following failed" });
          res.json({ message: "Now following user" });
        }
      );
    }
  );
};

//a user unfollowing a following user's account
exports.unFollowUser = (req, res) => {
  const followerId = req.user.id;
  const followingId = parseInt(req.params.id);

  db.run(
    `DELETE FROM followers WHERE followerId = ? AND followingId = ?`,
    [followerId, followingId],
    (err, row) => {
      if (err || this.changes === 0)
        return res.status(500).json({ error: "Unfollowing the user" });
      res.json({ message: "Now unfollowing user" });
    }
  );
};

//retrieving all the users following the account
exports.getFollowers = (req, res) => {
  const userId = parseInt(req.params.id);

  db.all(
    `SELECT u.id, u.username FROM users u JOIN followers f ON f.followerId = u.id WHERE f.followingId = ?`,
    [followerId, followingId],
    (err, rows) => {
      if (err || this.changes === 0)
        return res.status(500).json({ error: "Failed to fetch the followers" });
      res.json({ rows });
    }
  );
};

//retrieving all the users followed by the user
exports.getFollowing = (req, res) => {
  const userId = parseInt(req.params.id);
  db.all(
    `SELECT u.id, u.username FROM users u
       JOIN followers f ON f.followingId = u.id
       WHERE f.followerId = ?`,
    [userId],
    (err, rows) => {
      if (err)
        return res
          .status(500)
          .json({ error: "Failed to fetch following list" });
      res.json(rows);
    }
  );
};

//retrieving the posts created by the user following accounts
exports.getUserFeed = (req, res) => {
  const userId = req.user.id;

  db.all(
    `SELECT p.*, u.username as author FROM posts p JOIN users u ON p.userId = u.id WHERE p.userId IN ( SELECT followingId FROM followers WHERE followerId = ?) ORDER BY p.date DESC`,
    [userId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: "Failed to fetch feed" });
      res.json(rows);
    }
  );
};

//retrieving the profile summary about the user
exports.getUserProfileSummary = (req, res) => {
  const userId = req.user.id;

  db.get("SELECT email FROM users WHERE id = ?", [userId], (err, user) => {
    if (err || !user) return res.status(404).json({ error: "User not found" });

    const result = {
      userId,
      email: user.email,
      followersCount: 0,
      followingCount: 0,
      postCount: 0,
      posts: [],
    };
    db.get(
      "SELECT COUNT(*) as count FROM followers WHERE followingId = ?",
      [userId],
      (err, row1) => {
        result.followersCount = row1?.count || 0;

        db.get(
          "SELECT COUNT(*) as count FROM followers WHERE followerId = ?",
          [userId],
          (err, row2) => {
            result.followingCount = row2?.count || 0;

            db.all(
              "SELECT * FROM posts WHERE userId = ?",
              [userId],
              (err, posts) => {
                if (err) {
                  console.error(
                    "Error fetching posts for user summary:",
                    err.message
                  );
                  return res
                    .status(500)
                    .json({ error: "Failed to fetch user posts" });
                }
                result.postCount = posts.length;
                result.posts = posts;
                return res.json(result);
              }
            );
          }
        );
      }
    );
  });
};

//retrieving a public profile details
exports.getPublicUserProfile = (req, res) => {
  const userId = parseInt(req.params.id);

  db.get("SELECT id, email FROM users WHERE id = ?", [userId], (err, user) => {
    if (err || !user) return res.status(404).json({ error: "User not found" });

    const result = {
      userId: user.id,
      email: user.email,
      followersCount: 0,
      followingCount: 0,
      postCount: 0,
      posts: [],
    };

    db.get(
      "SELECT COUNT(*) as count FROM followers WHERE followingId = ?",
      [userId],
      (err, row1) => {
        result.followersCount = row1?.count || 0;

        db.get(
          "SELECT COUNT(*) as count FROM followers WHERE followerId = ?",
          [userId],
          (err, row2) => {
            result.followingCount = row2?.count || 0;

            db.all(
              "SELECT id, title, country, date FROM posts WHERE userId = ?",
              [userId],
              (err, posts) => {
                result.postCount = posts.length;
                result.posts = posts;

                return res.json(result);
              }
            );
          }
        );
      }
    );
  });
};

//retrieving the userId with the username
exports.getUserIdByUsername = (req, res) => {
  const username = req.params.username;
  db.get("SELECT id FROM users WHERE username = ?", [username], (err, user) => {
    if (err) {
      console.error("Error fetching user ID by username:", err.message);
      return res.status(500).json({ error: "Failed to fetch user ID" });
    }
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ id: user.id });
  });
};
