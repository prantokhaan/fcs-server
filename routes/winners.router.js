const express = require("express");
const router = express.Router();
const db = require("../database/database");


router.post("/addWinner", async (req, res) => {
  const { leagueId, teamId } = req.body;

  const checkQuery = "SELECT * FROM winners WHERE leagueId = ?";
  const insertQuery = "INSERT INTO winners (leagueId, teamId) VALUES (?, ?)";

  db.query(checkQuery, leagueId, (checkError, checkResults) => {
    if (checkError) {
      return res.status(400).json({ error: "Error checking leagueId" });
    } else {
      if (checkResults.length > 0) {
        return res.status(409).json({ error: "LeagueId already exists" });
      } else {
        // LeagueId doesn't exist, proceed with insertion
        db.query(
          insertQuery,
          [leagueId, teamId],
          (insertError, insertResults) => {
            if (insertError) {
              return res.status(400).json({ error: "Error adding winner" });
            } else {
              return res
                .status(200)
                .json({ message: "Winner added successfully" });
            }
          }
        );
      }
    }
  });
});

router.delete("/deleteWinner/:leagueId", async (req, res) => {
  const leagueId = req.params.leagueId;

  const deleteQuery = "DELETE FROM winners WHERE leagueId = ?";

  db.query(deleteQuery, leagueId, (error, results) => {
    if (error) {
      return res.status(400).json({ error: "Error deleting winners" });
    } else {
      if (results.affectedRows === 0) {
        return res
          .status(404)
          .json({ error: "No winners found for this leagueId" });
      } else {
        return res
          .status(200)
          .json({ message: "Winners deleted successfully" });
      }
    }
  });
});

router.get("/getAllLeagueWinners/:teamId", async (req, res) => {
  const teamId = req.params.teamId;

  const query = `
    SELECT *
    FROM winners
    INNER JOIN teams ON winners.teamId = teams.teamId
    INNER JOIN leagues ON winners.leagueId = leagues.leagueId
    WHERE winners.teamId = ?;
  `;

  db.query(query, teamId, (error, results) => {
    if (error) {
      return res.status(400).json({ error: "Error fetching league winners" });
    } else {
      return res.status(200).json(results);
    }
  });
});

module.exports = router;