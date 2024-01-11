const express = require("express");
const router = express.Router();
const db = require("../database/database");

router.post("/addPlayer", async (req, res) => {
  const { playerName, playerImage, playerDOB, playerPosition } = req.body;

  const insertQuery = `INSERT INTO players (playerName, playerImage, playerDOB, playerPosition) VALUES (?, ?, ?, ?)`;

  db.query(
    insertQuery,
    [playerName, playerImage, playerDOB, playerPosition],
    (insertError, data) => {
      if (insertError) {
        console.log(insertError);
        return res.status(400).json({ error: "Error registering player" });
      } else {
        return res.status(200).json({ playerName, playerImage, playerDOB });
      }
    }
  );
});

router.get("/getAllPlayer", async (req, res) => {
  const selectQuery = `SELECT * FROM players`;

  db.query(selectQuery, (error, results) => {
    if (error) {
      return res.status(400).json({ error: "Error fetching players" });
    } else {
      return res.status(200).json(results);
    }
  });
});

router.get("/getSinglePlayer/:playerId", async (req, res) => {
  const playerId = req.params.playerId;

  const query = "SELECT * FROM players WHERE playerId = ?";

  db.query(query, playerId, (error, results) => {
    if (error) {
      return res.status(400).json({ error: "Error fetching player" });
    } else {
      if (results.length === 0) {
        return res.status(404).json({ error: "Player not found" });
      } else {
        return res.status(200).json(results);
      }
    }
  });
});

router.post("/editSinglePlayer/", async (req, res) => {
  const playerId = req.body.playerId;
  const { playerName, playerImage, playerDOB, playerPosition } = req.body;

  const query = `
    UPDATE players
    SET playerName = ?,
        playerImage = ?,
        playerPosition = ?
    WHERE playerId = ?;
  `;

  db.query(
    query,
    [playerName, playerImage, playerPosition, playerId],
    (error, results) => {
      if (error) {
        console.log(error);
        return res.status(400).json({ error: "Error editing player" });
      } else {
        return res
          .status(200)
          .json({ message: "Player details updated successfully" });
      }
    }
  );
});

router.get("/getSearchByPlayerName/:name", async (req, res) => {
  const name = "%" + req.params.name + "%";
  const query = `SELECT * FROM players WHERE playerName LIKE ?;`;

  db.query(query, [name], (error, results) => {
    if (error) {
      return res.status(400).json({ error: "Error fetching players" });
    } else {
      return res.status(200).json(results);
    }
  });
});

router.delete("/deletePlayer/:playerId", async (req, res) => {
  const playerId = req.params.playerId;

  const deleteQuery = `DELETE FROM players WHERE playerId = ?`;

  db.query(deleteQuery, playerId, (error, results) => {
    if (error) {
      return res.status(400).json({ error: "Error deleting player" });
    } else {
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "Player not found" });
      } else {
        return res.status(200).json({ message: "Player deleted successfully" });
      }
    }
  });
});

router.get("/searchPlayer/:name", async (req, res) => {
  const playerNamePattern = req.params.name;

  const searchQuery = `
    SELECT playerId, playerName, playerImage, playerDOB, playerAge
    FROM players
    WHERE playerName LIKE ?;
  `;

  db.query(searchQuery, [`%${playerNamePattern}%`], (error, results) => {
    if (error) {
      return res.status(400).json({ error: "Error searching player" });
    } else {
      return res.status(200).json(results);
    }
  });
});


module.exports = router;