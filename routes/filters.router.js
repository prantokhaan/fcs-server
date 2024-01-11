const express = require("express");
const router = express.Router();
const db = require("../database/database");


router.get("/filterTeams/:filterType", (req, res) => {
  const filterType = req.params.filterType;

  db.query(`CALL FilterTeams('${filterType}')`, (error, results) => {
    if (error) {
      console.error("Error calling stored procedure: " + error);
      res.status(500).json({ error: "An error occurred" });
    } else {
      res.status(200).json(results[0]);
    }
  });
});

router.get("/filterPlayers/:filterType", (req, res) => {
  const filterType = req.params.filterType;

  db.query(`CALL FilterPlayers('${filterType}')`, (error, results) => {
    if (error) {
      console.error("Error calling stored procedure: " + error);
      res.status(500).json({ error: "An error occurred" });
    } else {
      res.status(200).json(results[0]);
    }
  });
});


module.exports = router;