const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const auth = require("./routes/authRoute");


const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "sql12.freesqldatabase.com",
  user: "sql12674871",
  password: "bULM2NF9ip",
  database: "sql12674871",
});

app.post("/login", async (req, res) => {
  const user = req.body.user;
  const password = req.body.password;

  const query = `select * from user where user=?`;

  db.query(query, [user], (error, results) => {
    if (error) {
      res.status(400).json(error);
    } else {
      if (results.length > 0) {
        const user = results[0];
        if (user.password != password) {
          const err = "password incorrect";
          res.status(400).json(err);
        } else {
          res.send(user);
        }
      } else {
        const err = "user not found";
        res.status(400).json(err);
      }
    }
  });
});

app.get("/getAllTeam", (req, res) => {
  const query = "SELECT * FROM teams";

  db.query(query, (error, results) => {
    if (error) {
      return res.status(400).json({ error: "Error retrieving teams" });
    } else {
      return res.status(200).json(results);
    }
  });
});

app.get("/getAllLeague", (req, res) => {
  const query = "SELECT * FROM leagues";

  db.query(query, (error, results) => {
    if (error) {
      return res.status(400).json({ error: "Error retrieving leagues" });
    } else {
      return res.status(200).json(results);
    }
  });
});

app.get("/getAllRunningLeague", (req, res) => {
  const query = `SELECT * FROM leagues where leagueStatus="Running"`;

  db.query(query, (error, results) => {
    if (error) {
      return res.status(400).json({ error: "Error retrieving teams" });
    } else {
      return res.status(200).json(results);
    }
  });
});
app.get("/getAllPendingLeague", (req, res) => {
  const query = `SELECT * FROM leagues where leagueStatus="Pending"`;

  db.query(query, (error, results) => {
    if (error) {
      return res.status(400).json({ error: "Error retrieving teams" });
    } else {
      return res.status(200).json(results);
    }
  });
});
app.get("/getSingleLeague/:leagueId", (req, res) => {
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

app.post("/editLeague", (req, res) => {
  console.log(req.body);
  const {leagueId, leagueStatus} = req.body;

  const query = `update leagues set leagueStatus = ? where leagueId = ?`;
  db.query(query, [leagueStatus, leagueId], (error, results) => {
    if (error) {
      return res.status(400).json({ error: "Error retrieving teams" });
    } else {
      return res.status(200).json(results);
    }
  })
})

app.get("/getAllLeagueTeams/:id", (req, res) => {
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
app.get("/getAllMatch/:id", (req, res) => {
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
        matchId: match.matchId
      }));
      return res.status(200).json(formattedResults);
    }
  });
});

app.get("/getAllCompletedMatch/:id", (req, res) => {
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
        matchId: match.matchId
      }));
      return res.status(200).json(formattedResults);
    }
  });
});

app.get("/getSingleMatch/:id", async (req, res) => {
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


app.post("/addLeagueTeams", async (req, res) => {
  const leagueId = req.body.leagueId;
  const teamName = req.body.teamName;

  const valid = "SELECT * FROM teams WHERE teamName=?";

  db.query(valid, [teamName], (error, results) => {
    if (error) {
      return res.status(400).json({ error: "Error checking duplicate name" });
    } else {
      if (results.length === 0) {
        return res.status(400).json({ error: "Team doesn't exist" });
      } else {
        const newLeagueTeam = {
          leagueId,
          teamId: results[0].teamId,
          played: 0,
          win: 0,
          draw: 0,
          lose: 0,
          gf: 0,
          ga: 0,
        };

        const count =
          "SELECT count(*) AS count FROM leagueTeams WHERE leagueId=?";
        db.query(count, [leagueId], (countError, countResult) => {
          const capacity =
            "SELECT leagueNoOfTeams FROM leagues WHERE leagueId = ?";
          db.query(capacity, [leagueId], (capError, capRes) => {
            if (countResult[0].count === capRes[0].leagueNoOfTeams) {
              return res
                .status(400)
                .json({
                  error:
                    "This league has reached max teams. No more teams can be added",
                });
            } else {
              const insertQuery = `INSERT INTO leagueTeams SET ?`;

              db.query(insertQuery, newLeagueTeam, (insertError, data) => {
                if (insertError) {
                  return res
                    .status(400)
                    .json({ error: "Error registering league teams" });
                } else {
                  return res.status(200).json(newLeagueTeam);
                }
              });
            }
          });
        });
      }
    }
  });
});

app.get("/getPointTable/:id", (req, res) => {
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



app.post("/editMatchResult", (req, res) => {
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

  
app.delete("/deleteLeague/:leagueId", (req, res) => {
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

app.delete("/deleteLeagueTeam/:leagueTeamId", (req, res) => {
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
        
        return res.status(200).json({ message: "League team deleted successfully" });
      }
    }
  });
});

app.delete("/deleteTeam/:teamId", (req, res) => {
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

app.delete("/deleteMatch/:matchId", (req, res) => {
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


app.post("/addLeague", async (req, res) => {
    const leagueName = req.body.leagueName;
    const leagueType = req.body.leagueType;
    const leagueNoOfTeams = req.body.leagueNoOfTeams;
    const leagueStatus = req.body.leagueStatus;

    const duplicate = "select * from leagues where leagueName = ?";

    db.query(duplicate, [leagueName], (error, results) => {
        if(error){
            return res.status(400).json({error: "Error checking duplicate name"});
        }else{
            if(results.length>0){
                return res.status(400).json({error: "League Name already exists"});
            }else{
                const newLeague = {
                    leagueName,
                    leagueType,
                    leagueNoOfTeams,
                    leagueStatus
                }

                const insertQuery = `insert into leagues set ?`;

                db.query(insertQuery, newLeague, (insertError, data) => {
                  if (insertError) {
                    return res
                      .status(400)
                      .json({ error: "Error registering league" });
                  } else {
                    return res
                      .status(200)
                      .json(newLeague);
                  }
                });
            }
        }
    })
});

app.post("/addMatch", (req, res) => {
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





app.post("/addTeam", async (req, res) => {
    const teamName = req.body.teamName;
    const teamLogo = req.body.teamLogo;
    const teamRating = req.body.teamRating;

    const duplicate = `select * from teams where teamName = ?`;

    db.query(duplicate, [teamName], (error, results) => {
        if(error){
            return res.status(400).json({error: "Erro checking duplicate name"});
        }else{
            if(results.length>0){
                return res.status(400).json({error: "Team Name already exists"});

            }else{
                const newTeam = {
                    teamName: teamName,
                    teamLogo: teamLogo,
                    teamRating: teamRating
                };

                const insertQuery = `insert into teams set ?`;

                db.query(insertQuery, newTeam, (insertError, data) => {
                  if (insertError) {
                    return res
                      .status(400)
                      .json({ error: "Error registering team" });
                  } else {
                    return res.status(200).json({ teamName, teamLogo, teamRating }); 
                  }
                });
                
            }
        }
    })
});



app.post("/register", async (req, res) => {
  const user = req.body.user;
  const password = req.body.password;
  const role = req.body.role;

  const duplicateCheckQuery = `SELECT * FROM users WHERE user = ?`;

  db.query(duplicateCheckQuery, [user], (error, results) => {
    if (error) {
      return res
        .status(400)
        .json({ error: "Error checking duplicate username" });
    } else {
      if (results.length > 0) {
        return res.status(400).json({ error: "Username already exists" });
      } else {
        const newUser = {
          user: user,
          password: password,
          role: role,
        };

        const insertQuery = `INSERT INTO users SET ?`;

        db.query(insertQuery, newUser, (insertError, data) => {
          if (insertError) {
            return res.status(400).json({ error: "Error registering user" });
          } else {
            return res.status(200).json({ user, password }); // Sending user and password back
          }
        });
      }
    }
  });
});

app.post("/login", async (req, res) => {
  const user = req.body.user;
  const password = req.body.password;

  const query = `SELECT * FROM user WHERE user=?`;

  db.query(query, [user], (error, results) => {
    if (error) {
      res.status(400).json({ error: "Error retrieving user" });
    } else {
      if (results.length > 0) {
        const userData = results[0];
        if (userData.password !== password) {
          res.status(400).json({ error: "Password incorrect" });
        } else {
          res.status(200).json({ user });
        }
      } else {
        res.status(400).json({ error: "User not found" });
      }
    }
  });
});


app.get("/leagues", (req, res) => {
    const q = "select * from employees where salary>7000";
    db.query(q, (err, data)=> {
        if(err) return res.json(err);
        return res.json(data);
    })
})

app.post("/create", (req, res) => {
    const q = "create database football_competition_simulator"

    db.query(q, (err, data) => {
        if(err) return res.json(err);
        return res.json(data);
    })
})

app.post("/addStudent", (req, res)=> {
    const q = "insert into student(`name`, `phone`, `dob`)values(?)";
    const values = [
        req.body.name,
        req.body.phone,
        req.body.dob
    ];

    db.query(q, [values], (err, data)=> {
        if(err) return res.json(err);
        return res.json(data); 
    })
})

app.get("/", (req, res) => {
    res.json("Hello, this is the backend");
})

app.listen(8800, () => {
    console.log("Connected to backend")
})