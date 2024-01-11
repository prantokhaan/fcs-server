const express = require("express");
const router = express.Router();
const db = require("../database/database");

router.get("/getAllTeamPlayers/:teamId", async (req, res) => {
  const teamId = req.params.teamId;

  const selectQuery = `
    SELECT *
    FROM teamPlayers
    JOIN players ON teamPlayers.playerId = players.playerId
    WHERE teamPlayers.teamId = ?;
  `;

  db.query(selectQuery, teamId, (error, results) => {
    if (error) {
      return res.status(400).json({ error: "Error fetching team players" });
    } else {
      return res.status(200).json(results);
    }
  });
});

router.delete("/deleteTeamPlayer/:teamPlayerId", async (req, res) => {
  const teamPlayerId = req.params.teamPlayerId;

  const deleteQuery = "DELETE FROM teamPlayers WHERE teamPlayerId = ?";

  db.query(deleteQuery, teamPlayerId, (error, results) => {
    if (error) {
      return res.status(400).json({ error: "Error deleting team player" });
    } else {
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "Team player not found" });
      } else {
        return res
          .status(200)
          .json({ message: "Team player deleted successfully" });
      }
    }
  });
});

router.post("/addTeamPlayer", async (req, res) => {
  const { teamId, playerId } = req.body;

  const searchQuery = "SELECT * FROM teamPlayers WHERE playerId = ?";
  db.query(searchQuery, [playerId], (searchError, searchResults) => {
    if (searchError) {
      return res
        .status(400)
        .json({ error: "Error searching for player in team" });
    } else {
      if (searchResults.length > 0) {
        return res.status(409).json({ error: "Player is already in a team" });
      } else {
        const addQuery =
          "INSERT INTO teamPlayers (playerId, teamId) VALUES (?, ?)";
        db.query(addQuery, [playerId, teamId], (addError, addResults) => {
          if (addError) {
            return res
              .status(400)
              .json({ error: "Error adding player to team" });
          } else {
            return res
              .status(200)
              .json({ message: "Player added to team successfully" });
          }
        });
      }
    }
  });
});



module.exports = router;