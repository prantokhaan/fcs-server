const express = require("express");
const router = express.Router();
const db = require("../database/database");

router.get("/getTeamMatches/:id", (req, res) => {
  const teamId = req.params.id;

  const query = `SELECT
                    t1.teamName AS teamOneName,
                    t2.teamName AS teamTwoName,
                    t1.teamLogo AS teamOneLogo,
                    t2.teamLogo AS teamTwoLogo,
                    m.matchId,
                    m.teamOneId,
                    m.teamTwoId,
                    m.scoreOne,
                    m.scoreTwo,
                    l.leagueName
                FROM matches m
                JOIN teams t1 ON m.teamOneId = t1.teamId
                JOIN teams t2 ON m.teamTwoId = t2.teamId
                JOIN leagues l ON m.leagueId = l.leagueId
                WHERE m.teamOneId = ? OR m.teamTwoId = ?`;

  db.query(query, [teamId, teamId], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json(results);
    }
  });
});


module.exports = router;