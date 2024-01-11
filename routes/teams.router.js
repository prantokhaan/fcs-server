const express = require("express");
const router = express.Router();
const db = require("../database/database");

router.get("/getAllTeam", (req, res) => {
  const query = "SELECT * FROM teams";

  db.query(query, (error, results) => {
    if (error) {
      return res.status(400).json({ error: "Error retrieving teams" });
    } else {
      return res.status(200).json(results);
    }
  });
});

router.get("/getSingleTeam/:teamId", (req, res) => {
  const teamId = req.params.teamId;
  const query = `SELECT * FROM teams where teamId=?`;

  db.query(query, [teamId], (error, results) => {
    if (error) {
      return res.status(400).json({ error: "Error retrieving teams" });
    } else {
      return res.status(200).json(results);
    }
  });
});


router.post("/editSingleTeam/", (req, res) => {
  const teamId = req.body.teamId;
  const teamName = req.body.teamName;
  const teamLogo = req.body.teamLogo;
  const teamRating = req.body.teamRating;

  const query =
    "UPDATE teams SET teamName = ?, teamRating = ?, teamLogo = ? WHERE teamId = ?";

  db.query(
    query,
    [teamName, teamRating, teamLogo, teamId],
    (error, results) => {
      if (error) {
        return res.status(400).json({ error: "Error editing teams" });
      } else {
        return res.status(200).json(results);
      }
    }
  );
});

router.get("/getSearchByTeamName/:name", async (req, res) => {
  const name = "%" + req.params.name + "%";
  console.log(name);
  const query = `SELECT * FROM teams WHERE teamName LIKE ?;`;

  db.query(query, [name], (error, results) => {
    if (error) {
      return res.status(400).json({ error: "Error fetching teams" });
    } else {
      console.log(results);
      return res.status(200).json(results);
    }
  });
});

router.delete("/deleteTeam/:teamId", (req, res) => {
  const teamId = req.params.teamId;

  const deleteTeamQuery = `DELETE FROM teams WHERE teamId = ?`;
  db.query(deleteTeamQuery, [teamId], (error, results) => {
    if (error) {
      return res.status(500).json({ error: "Error deleting league" });
    } else {
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "Team not found" });
      } else {
        return res.status(200).json({ message: "League deleted successfully" });
      }
    }
  });
});

router.post("/addTeam", async (req, res) => {
  const teamName = req.body.teamName;
  const teamLogo = req.body.teamLogo;
  const teamRating = req.body.teamRating;

  const duplicate = `select * from teams where teamName = ?`;

  db.query(duplicate, [teamName], (error, results) => {
    if (error) {
      return res.status(400).json({ error: "Error checking duplicate name" });
    } else {
      if (results.length > 0) {
        return res.status(400).json({ error: "Team Name already exists" });
      } else {
        const newTeam = {
          teamName: teamName,
          teamLogo: teamLogo,
          teamRating: teamRating,
        };

        const insertQuery = `insert into teams set ?`;

        db.query(insertQuery, newTeam, (insertError, data) => {
          if (insertError) {
            return res.status(400).json({ error: "Error registering team" });
          } else {
            return res.status(200).json({ teamName, teamLogo, teamRating });
          }
        });
      }
    }
  });
});



module.exports = router;