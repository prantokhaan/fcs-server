const express = require("express");
const router = express.Router();
const db = require("../database/database");


router.get("/getAllLeagueTeams/:id", (req, res) => {
  const leagueId = req.params.id;
  const query = `SELECT * FROM leagueTeams AS l JOIN teams AS t ON l.teamId = t.teamId WHERE leagueId = ?`;

  db.query(query, [leagueId], (error, results) => {
    if (error) {
      return res.status(400).json({ error: "Error retrieving teams" });
    } else {
      return res.status(200).json(results);
    }
  });
});

router.get("/getSearchByLeagueTeamName/:name", async (req, res) => {
  const teamName = "%" + req.params.name + "%"; // Add wildcards to the search term

  const query = `
    SELECT teams.*
    FROM teams
    JOIN leagueTeams ON teams.teamId = leagueTeams.teamId
    WHERE teams.teamName LIKE ?
  `;

  db.query(query, [teamName], (error, results) => {
    if (error) {
      return res.status(400).json({ error: "Error fetching teams" });
    } else {
      if (results.length === 0) {
        return res.status(400).json({ error: "No teams found" });
      } else {
        return res.status(200).json(results);
      }
    }
  });
});

router.post("/addLeagueTeams", async (req, res) => {
  const leagueId = req.body.leagueId;
  const teamName = req.body.teamName;

  const getTeamQuery = "SELECT * FROM teams WHERE teamName=?";
  const checkDuplicateQuery =
    "SELECT * FROM leagueTeams WHERE leagueId=? AND teamId=?";

  db.query(getTeamQuery, [teamName], (error, teamResults) => {
    if (error) {
      return res.status(400).json({ error: "Error checking duplicate name" });
    } else {
      if (teamResults.length === 0) {
        return res.status(400).json({ error: "Team doesn't exist" });
      } else {
        const teamId = teamResults[0].teamId;

        db.query(
          checkDuplicateQuery,
          [leagueId, teamId],
          (dupeError, dupeResults) => {
            if (dupeError) {
              return res
                .status(400)
                .json({ error: "Error checking duplicates" });
            } else {
              if (dupeResults.length > 0) {
                return res
                  .status(400)
                  .json({ error: "Team already added to this league" });
              } else {
                const newLeagueTeam = {
                  leagueId,
                  teamId,
                  played: 0,
                  win: 0,
                  draw: 0,
                  lose: 0,
                  gf: 0,
                  ga: 0,
                };

                const countQuery =
                  "SELECT COUNT(*) AS count FROM leagueTeams WHERE leagueId=?";
                const capacityQuery =
                  "SELECT leagueNoOfTeams FROM leagues WHERE leagueId = ?";

                db.query(countQuery, [leagueId], (countError, countResult) => {
                  if (countError) {
                    return res
                      .status(400)
                      .json({ error: "Error counting league teams" });
                  } else {
                    const currentTeamCount = countResult[0].count;

                    db.query(capacityQuery, [leagueId], (capError, capRes) => {
                      if (capError) {
                        return res
                          .status(400)
                          .json({ error: "Error fetching league capacity" });
                      } else {
                        const leagueCapacity = capRes[0].leagueNoOfTeams;

                        if (currentTeamCount >= leagueCapacity) {
                          return res.status(400).json({
                            error:
                              "This league has reached its maximum team limit",
                          });
                        } else {
                          const insertQuery = "INSERT INTO leagueTeams SET ?";

                          db.query(
                            insertQuery,
                            newLeagueTeam,
                            (insertError, data) => {
                              if (insertError) {
                                return res.status(400).json({
                                  error: "Error registering league teams",
                                });
                              } else {
                                return res.status(200).json(newLeagueTeam);
                              }
                            }
                          );
                        }
                      }
                    });
                  }
                });
              }
            }
          }
        );
      }
    }
  });
});

router.delete("/deleteLeagueTeam/:leagueTeamId", (req, res) => {
  const leagueId = req.params.leagueTeamId;

  const match = `select teamId from leagueTeams where leagueTeamId = ?`;
  db.query(match, [leagueId], (error, teamResult) => {
    if (error) {
      return res.status(500).json({ error: "Error deleting league team" });
    } else {
      console.log("teamResult");
      console.log(teamResult[0].teamId);
      const delMatchQuery = `delete from matches where teamOneId = ? or teamTwoId = ?`;
      db.query(delMatchQuery, [teamResult[0].teamId, teamResult[0].teamId]);
    }
  });

  const deleteLeagueQuery = `DELETE FROM leagueTeams WHERE leagueTeamId = ?`;
  db.query(deleteLeagueQuery, [leagueId], (error, results) => {
    if (error) {
      return res.status(500).json({ error: "Error deleting league team" });
    } else {
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "League team not found" });
      } else {
        return res
          .status(200)
          .json({ message: "League team deleted successfully" });
      }
    }
  });
});


module.exports = router;