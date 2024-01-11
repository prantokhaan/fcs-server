const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");


const auth = require("./routes/auth.router");
const teams = require("./routes/teams.router");
const leagues = require("./routes/leagues.router");
const players = require("./routes/players.router");
const matches = require("./routes/matches.router");
const filters = require("./routes/filters.router");
const leagueTeams = require("./routes/leagueTeams.router");
const pointTable = require("./routes/pointTable.router");
const teamMatches = require("./routes/teamMatches.router");
const teamPlayers = require("./routes/teamPlayers.router");
const winners = require("./routes/winners.router");


const app = express();
app.use(express.urlencoded({ extended: false }));

app.use(cors());
app.use(express.json());



app.use("/", auth);
app.use("/", teams);
app.use("/", leagues);
app.use("/", players);
app.use("/", matches);
app.use("/", leagueTeams);
app.use("/", teamPlayers);
app.use("/", teamMatches);
app.use("/", pointTable);
app.use("/", filters);
app.use("/", winners);


app.get("/", (req, res) => {
    res.json("Hello, this is the backend");
})

app.listen(8800, () => {
    console.log("Connected to backend")
});



