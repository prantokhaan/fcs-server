const express = require("express");
const router = express.Router();
const db = require("../database/database");


router.get("/getAllLeague", (req, res) => {
  const query = "SELECT * FROM leagues";

  db.query(query, (error, results) => {
    if (error) {
      return res.status(400).json({ error: "Error retrieving leagues" });
    } else {
      return res.status(200).json(results);
    }
  });
});

router.post("/addLeague", async (req, res) => {
  const leagueName = req.body.leagueName;
  const leagueType = req.body.leagueType;
  const leagueNoOfTeams = req.body.leagueNoOfTeams;
  const leagueStatus = req.body.leagueStatus;

  const duplicate = "select * from leagues where leagueName = ?";

  db.query(duplicate, [leagueName], (error, results) => {
    if (error) {
      return res.status(400).json({ error: "Error checking duplicate name" });
    } else {
      if (results.length > 0) {
        return res.status(400).json({ error: "League Name already exists" });
      } else {
        const newLeague = {
          leagueName,
          leagueType,
          leagueNoOfTeams,
          leagueStatus,
        };

        const insertQuery = `insert into leagues set ?`;

        db.query(insertQuery, newLeague, (insertError, data) => {
          if (insertError) {
            return res.status(400).json({ error: "Error registering league" });
          } else {
            return res.status(200).json(newLeague);
          }
        });
      }
    }
  });
});

router.get("/getAllRunningLeague", (req, res) => {
  const query = `SELECT * FROM leagues where leagueStatus="Running"`;

  db.query(query, (error, results) => {
    if (error) {
      return res.status(400).json({ error: "Error retrieving teams" });
    } else {
      return res.status(200).json(results);
    }
  });
});

router.get("/getAllCompletedLeague", (req, res) => {
  const query = `SELECT * FROM leagues where leagueStatus="Completed"`;

  db.query(query, (error, results) => {
    if (error) {
      return res.status(400).json({ error: "Error retrieving teams" });
    } else {
      return res.status(200).json(results);
    }
  });
});

router.get("/getAllPendingLeague", (req, res) => {
  const query = `SELECT * FROM leagues where leagueStatus="Pending"`;

  db.query(query, (error, results) => {
    if (error) {
      return res.status(400).json({ error: "Error retrieving teams" });
    } else {
      return res.status(200).json(results);
    }
  });
});

router.get("/getSingleLeague/:leagueId", (req, res) => {
  const leagueId = req.params.leagueId;
  const query = `SELECT * FROM leagues where leagueId=?`;

  db.query(query, [leagueId], (error, results) => {
    if (error) {
      return res.status(400).json({ error: "Error retrieving teams" });
    } else {
      return res.status(200).json(results);
    }
  });
});

router.post("/editLeague", (req, res) => {
  console.log(req.body);
  const { leagueId, leagueStatus } = req.body;

  const query = `update leagues set leagueStatus = ? where leagueId = ?`;
  db.query(query, [leagueStatus, leagueId], (error, results) => {
    if (error) {
      return res.status(400).json({ error: "Error retrieving teams" });
    } else {
      return res.status(200).json(results);
    }
  });
});

router.delete("/deleteLeague/:leagueId", (req, res) => {
  const leagueId = req.params.leagueId;

  const deleteLeagueQuery = `DELETE FROM leagues WHERE leagueId = ?`;
  db.query(deleteLeagueQuery, [leagueId], (error, results) => {
    if (error) {
      return res.status(500).json({ error: "Error deleting league" });
    } else {
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "League not found" });
      } else {
        return res.status(200).json({ message: "League deleted successfully" });
      }
    }
  });
});




module.exports = router;