const express = require("express");
const router = express.Router();
const db = require("../database/database");


router.get("/getAllMatch/:id", (req, res) => {
  const leagueId = req.params.id;
  const query = `
    SELECT t1.teamName AS teamOneName, t2.teamName AS teamTwoName, t1.teamLogo as teamOneLogo, t2.teamLogo as teamTwoLogo, m.matchRound as matchRound, m.matchId as matchId
    FROM matches m
    JOIN teams t1 ON m.teamOneId = t1.teamId
    JOIN teams t2 ON m.teamTwoId = t2.teamId
    WHERE m.leagueId = ? and m.status="pending"
    order by m.matchRound`;

  db.query(query, [leagueId], (error, results) => {
    if (error) {
      return res.status(400).json({ error: "Error retrieving matches" });
    } else {
      const formattedResults = results.map((match) => ({
        teamOneName: match.teamOneName,
        teamTwoName: match.teamTwoName,
        teamOneLogo: match.teamOneLogo,
        teamTwoLogo: match.teamTwoLogo,
        scoreOne: match.scoreOne,
        scoreTwo: match.scoreTwo,
        matchRound: match.matchRound,
        matchId: match.matchId,
      }));
      return res.status(200).json(formattedResults);
    }
  });
});

router.get("/getAllCompletedMatch/:id", (req, res) => {
  const leagueId = req.params.id;
  const query = `
    SELECT t1.teamName AS teamOneName, t2.teamName AS teamTwoName, t1.teamLogo as teamOneLogo, t2.teamLogo as teamTwoLogo, m.matchRound as matchRound, m.scoreOne as scoreOne, m.scoreTwo as scoreTwo, m.matchId as matchId
    FROM matches m
    JOIN teams t1 ON m.teamOneId = t1.teamId
    JOIN teams t2 ON m.teamTwoId = t2.teamId
    WHERE m.leagueId = ? and m.status="completed"
    order by m.matchRound`;

  db.query(query, [leagueId], (error, results) => {
    if (error) {
      return res.status(400).json({ error: "Error retrieving matches" });
    } else {
      const formattedResults = results.map((match) => ({
        teamOneName: match.teamOneName,
        teamTwoName: match.teamTwoName,
        teamOneLogo: match.teamOneLogo,
        teamTwoLogo: match.teamTwoLogo,
        scoreOne: match.scoreOne,
        scoreTwo: match.scoreTwo,
        matchRound: match.matchRound,
        matchId: match.matchId,
      }));
      return res.status(200).json(formattedResults);
    }
  });
});

router.get("/getSingleMatch/:id", async (req, res) => {
  const matchId = req.params.id;

  const query = `
      SELECT m.*, t1.teamName AS teamOneName, t2.teamName AS teamTwoName, t1.teamLogo as teamOneLogo, t2.teamLogo as teamTwoLogo
      FROM matches AS m
      JOIN teams AS t1 ON m.teamOneId = t1.teamId
      JOIN teams AS t2 ON m.teamTwoId = t2.teamId
      WHERE m.matchId = ?
    `;

  db.query(query, [matchId], (error, results) => {
    if (error) {
      return res.status(400).json({ error: "Error fetching match" });
    } else {
      console.log(results);
      return res.status(200).json(results);
    }
  });
});

router.post("/editMatchResult", (req, res) => {
  const { matchId, scoreOne, scoreTwo } = req.body;

  // Set scoreOne and scoreTwo for the match
  const updateMatchQuery = `UPDATE matches SET scoreOne = ?, scoreTwo = ?, status = 'completed' WHERE matchId = ?`;
  db.query(
    updateMatchQuery,
    [scoreOne, scoreTwo, matchId],
    (matchUpdateError) => {
      if (matchUpdateError) {
        return res.status(500).json({ error: "Error updating match result" });
      }

      // Update leagueTeams table
      const getMatchDetailsQuery = `SELECT teamOneId, teamTwoId FROM matches WHERE matchId = ?`;
      db.query(getMatchDetailsQuery, [matchId], (matchError, matchResults) => {
        if (matchError || matchResults.length === 0) {
          return res
            .status(500)
            .json({ error: "Error fetching match details" });
        }

        const { teamOneId, teamTwoId } = matchResults[0];

        let winQuery = "";
        if (scoreOne > scoreTwo) {
          winQuery = `UPDATE leagueTeams SET win = win + 1 WHERE teamId = ?`;
          db.query(winQuery, [teamOneId], (teamOneWinError) => {
            if (teamOneWinError) {
              return res
                .status(500)
                .json({ error: "Error updating team one's win count" });
            }
            return res
              .status(200)
              .json({ message: "Match result updated successfully" });
          });
        } else if (scoreOne < scoreTwo) {
          winQuery = `UPDATE leagueTeams SET win = win + 1 WHERE teamId = ?`;
          db.query(winQuery, [teamTwoId], (teamTwoWinError) => {
            if (teamTwoWinError) {
              return res
                .status(500)
                .json({ error: "Error updating team two's win count" });
            }
            return res
              .status(200)
              .json({ message: "Match result updated successfully" });
          });
        } else {
          const drawQuery = `UPDATE leagueTeams SET draw = draw + 1 WHERE teamId IN (?, ?)`;
          db.query(drawQuery, [teamOneId, teamTwoId], (drawError) => {
            if (drawError) {
              return res
                .status(500)
                .json({ error: "Error updating draw count" });
            }
            return res
              .status(200)
              .json({ message: "Match result updated successfully" });
          });
        }

        const incrementPlayedQuery = `UPDATE leagueTeams SET played = played + 1 WHERE teamId IN (?, ?)`;
        db.query(incrementPlayedQuery, [teamOneId, teamTwoId]);

        const updateGFQuery = `UPDATE leagueTeams SET gf = gf + ?, ga = ga + ? WHERE teamId = ?`;
        db.query(updateGFQuery, [scoreOne, scoreTwo, teamOneId]);
        db.query(updateGFQuery, [scoreTwo, scoreOne, teamTwoId]);
      });
    }
  );
});

router.delete("/deleteMatch/:matchId", (req, res) => {
  const leagueId = req.params.matchId;

  const deleteLeagueQuery = `DELETE FROM matches WHERE matchId = ?`;
  db.query(deleteLeagueQuery, [leagueId], (error, results) => {
    if (error) {
      return res.status(500).json({ error: "Error deleting match" });
    } else {
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "Match not found" });
      } else {
        return res.status(200).json({ message: "Match deleted successfully" });
      }
    }
  });
});

router.post("/addMatch", (req, res) => {
  const { teamOneName, teamTwoName, leagueId, matchRound } = req.body;

  db.query(
    `SELECT teamId FROM leagueTeams WHERE leagueId = ? AND teamId = (SELECT teamId FROM teams WHERE teamName = ?)`,
    [leagueId, teamOneName],
    (errOne, [teamOneRows]) => {
      if (errOne || !teamOneRows || teamOneRows.length === 0) {
        return res
          .status(400)
          .json({ error: "Team One not found in the league" });
      }
      console.log(teamOneRows);
      const teamOneId = teamOneRows.teamId;

      db.query(
        `SELECT teamId FROM leagueTeams WHERE leagueId = ? AND teamId = (SELECT teamId FROM teams WHERE teamName = ?)`,
        [leagueId, teamTwoName],
        (errTwo, [teamTwoRows]) => {
          if (errTwo || !teamTwoRows || teamTwoRows.length === 0) {
            return res
              .status(400)
              .json({ error: "Team Two not found in the league" });
          }
          const teamTwoId = teamTwoRows.teamId;

          const insertMatchQuery = `INSERT INTO matches (leagueId, teamOneId, teamTwoId, matchRound, status, scoreOne, scoreTwo) VALUES (?, ?, ?, ?, ?, ?, ?)`;
          const values = [
            leagueId,
            teamOneId,
            teamTwoId,
            matchRound,
            req.body.status || "pending",
            req.body.scoreOne || 0,
            req.body.scoreTwo || 0,
          ];

          db.query(insertMatchQuery, values, (errInsert) => {
            if (errInsert) {
              return res.status(500).json({ error: "Internal server error" });
            }
            return res
              .status(200)
              .json({ message: "Match added successfully" });
          });
        }
      );
    }
  );
});

module.exports = router;