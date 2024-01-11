const express = require("express");
const router = express.Router();
const db = require("../database/database");

router.post("/login", async (req, res) => {
  const user = req.body.user;
  const password = req.body.password;

  const query = `SELECT * FROM users WHERE user=?`;

  db.query(query, [user], (error, results) => {
    if (error) {
      res.status(400).json({ error: "Error retrieving user" });
    } else {
      if (results.length > 0) {
        const userData = results[0];
        if (userData.password !== password) {
          res.status(400).json({ error: "Password incorrect" });
        } else {
          res.status(200).json({ user: user, role: results[0].role });
        }
      } else {
        res.status(400).json({ error: "User not found" });
      }
    }
  });
});

router.post("/register", async (req, res) => {
  const user = req.body.user;
  const password = req.body.password;
  const role = req.body.role;

  const duplicateCheckQuery = `SELECT * FROM users WHERE user = ?`;

  db.query(duplicateCheckQuery, [user], (error, results) => {
    if (error) {
      return res
        .status(400)
        .json({ error: "Error checking duplicate username" });
    } else {
      if (results.length > 0) {
        return res.status(400).json({ error: "Username already exists" });
      } else {
        const newUser = {
          user: user,
          password: password,
          role: role,
        };

        const insertQuery = `INSERT INTO users SET ?`;

        db.query(insertQuery, newUser, (insertError, data) => {
          if (insertError) {
            console.log(insertError)
            return res.status(400).json({ error: "Error registering user" });
          } else {
            return res.status(200).json({ user, password });
          }
        });
      }
    }
  });
});


module.exports = router;