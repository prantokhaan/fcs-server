const express = require("express");
const router = express.Router();
const db = require("../database/database");

router.get("/getPointTable/:id", (req, res) => {
  const leagueId = req.params.id;

  console.log(leagueId);

  const query = `
    SELECT
    t.teamId,
    t.teamName,
    t.teamLogo,SUM(
        CASE 
            WHEN m.teamOneId = lt.teamId AND m.scoreOne > m.scoreTwo THEN 1
            WHEN m.teamTwoId = lt.teamId AND m.scoreTwo > m.scoreOne THEN 1
            ELSE 0
        END
    ) AS wins,
    SUM(CASE 
            WHEN m.teamOneId = lt.teamId AND m.scoreOne > m.scoreTwo THEN 3
            WHEN m.teamTwoId = lt.teamId AND m.scoreTwo > m.scoreOne THEN 3
            WHEN m.teamOneId = lt.teamId AND m.scoreOne = m.scoreTwo AND m.status="completed" THEN 1
            WHEN m.teamTwoId = lt.teamId AND m.scoreOne = m.scoreTwo AND m.status="completed" THEN 1
            ELSE 0
        END) AS points,
    SUM(CASE 
            WHEN m.teamOneId = lt.teamId THEN m.scoreOne-m.scoreTwo
            WHEN m.teamTwoId = lt.teamId THEN m.scoreTwo-m.scoreOne
            ELSE 0
        END) AS goalDifference,
    SUM(CASE 
            WHEN m.teamOneId = lt.teamId THEN m.scoreOne
            WHEN m.teamTwoId = lt.teamId THEN m.scoreTwo
            ELSE 0
        END) AS goalsFor,
    SUM(CASE 
            WHEN m.teamOneId = lt.teamId THEN m.scoreTwo
            WHEN m.teamTwoId = lt.teamId THEN m.scoreOne
            ELSE 0
        END) AS goalsAgainst,
    
    SUM(CASE 
            WHEN m.teamOneId = lt.teamId AND m.scoreOne = m.scoreTwo AND m.status="completed" THEN 1
            WHEN m.teamTwoId = lt.teamId AND m.scoreTwo = m.scoreOne AND m.status="completed" THEN 1
            ELSE 0
        END) AS draws,
    SUM(CASE 
            WHEN m.teamOneId = lt.teamId AND m.scoreOne < m.scoreTwo THEN 1
            WHEN m.teamTwoId = lt.teamId AND m.scoreTwo < m.scoreOne THEN 1
            ELSE 0
        END) AS loses,
    SUM(CASE 
            WHEN m.teamOneId = lt.teamId AND m.status = "completed"  THEN 1
            WHEN m.teamTwoId = lt.teamId AND m.status = "completed" THEN 1
            ELSE 0
        END) AS played
FROM
    teams AS t
INNER JOIN
    leagueTeams AS lt ON t.teamId = lt.teamId
INNER JOIN
    matches AS m ON (m.teamOneId = lt.teamId OR m.teamTwoId = lt.teamId) AND m.leagueId = lt.leagueId
WHERE
    lt.leagueId = ?
GROUP BY
    t.teamId
ORDER BY 
    points DESC,
    goalDifference DESC,
    goalsFor DESC,
    goalsAgainst ASC,
    wins DESC,
    loses ASC,
    teamName ASC
  `;

  db.query(query, [leagueId], (error, results) => {
    if (error) {
      return res.status(400).json({ error: "Error fetching point table" });
    } else {
      console.log(results);
      return res.status(200).json(results);
    }
  });
});


module.exports = router;