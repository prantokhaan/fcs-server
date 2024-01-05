const express = require("express");
const router = express.Router();

router.post("/login", async (req, res) => {
  const user = req.body.user;
  const password = req.body.password;

  const query = `select * from user where user=?`;

  db.query(query, [user], (error, results) => {
    if (error) {
      res.status(400).json(error);
    } else {
      if (results.length > 0) {
        const user = results[0];
        if (user.password != password) {
          const err = "password incorrect";
          res.status(400).json(err);
        } else {
          res.send(user);
        }
      } else {
        const err = "user not found";
        res.status(400).json(err);
      }
    }
  });
});

module.exports = router;