-- Active: 1696535786042@@127.0.0.1@3306@football_competition_simulator


-- user AUTHENTICATION

select * from user where user = "iipranto";

insert into user set
user = "miturani",
password = "miturani",
role = "user";

select * from user where user = "miturani";


-- teams
-- get all teams
select * from teams;

-- get single team
select * from teams where teamId = 49;

-- edit team
update teams
set teamName = "ab"
where teamId = 61;

-- search by team name
select * from teams where teamName = "abc";

select * from teams where teamName like "%abc%";


-- delete team;
delete from teams WHERE teamId = 61;

-- add teams;
insert into teams SET
teamName = "a",
teamLogo = "a",
`teamRating` = "5";


-- leagues;
-- get all leagues;
select * from leagues;

-- find duplicate while creating league
select * from leagues where `leagueName` = "mitu league";

-- get all running league;
select * from leagues where `leagueStatus` = "running";

-- get all completed league;
select * from leagues where `leagueStatus` = "completed";

-- get all pending league;
select * from leagues where `leagueStatus` = "pending";

-- get single league;
select * from leagues where `leagueId` = 20;

-- edit league status;
update leagues
set `leagueStatus` = "Running"
where `leagueId` = 20;

update leagues
set `leagueStatus` = "completed"
where leagueId = 20;

-- delete leagues
delete from leagues where `leagueId` = 11;

-- leagueTeams
-- get league teams
select * 
from leagueTeams as l 
join teams as t 
on l.`teamId` = t.`teamId` 
where `leagueId` = 21;

-- search by league team name;
SELECT teams.*
FROM teams
JOIN leagueTeams ON teams.teamId = leagueTeams.teamId
WHERE teams.teamName LIKE "%ars%";

-- find team id by teamname
select * from teams where `teamName` = "Arsenal";

-- check duplicate league TEMPTABLE
SELECT * FROM leagueTeams WHERE leagueId=22 AND teamId=8


-- matches;
-- get all matches;
SELECT t1.teamName AS teamOneName, t2.teamName AS teamTwoName, t1.teamLogo as teamOneLogo, t2.teamLogo as teamTwoLogo, m.matchRound as matchRound, m.matchId as matchId
    FROM matches m
    JOIN teams t1 ON m.teamOneId = t1.teamId
    JOIN teams t2 ON m.teamTwoId = t2.teamId
    WHERE m.leagueId = ? and m.status="pending"
    order by m.matchRound

-- checking if a team contains in league
SELECT teamId FROM leagueTeams WHERE leagueId = ? AND teamId = (SELECT teamId FROM teams WHERE teamName = ?)

-- insert a MATCH
INSERT INTO matches (leagueId, teamOneId, teamTwoId, matchRound, status, scoreOne, scoreTwo) VALUES (?, ?, ?, ?, ?, ?, ?)

-- single match;
SELECT m.*, t1.teamName AS teamOneName, t2.teamName AS teamTwoName, t1.teamLogo as teamOneLogo, t2.teamLogo as teamTwoLogo
      FROM matches AS m
      JOIN teams AS t1 ON m.teamOneId = t1.teamId
      JOIN teams AS t2 ON m.teamTwoId = t2.teamId
      WHERE m.matchId = ?

-- edit match result;
UPDATE matches SET scoreOne = ?, scoreTwo = ?, status = 'completed' WHERE matchId = ?

-- get match details
SELECT teamOneId, teamTwoId FROM matches WHERE matchId = ?

-- update win;
UPDATE leagueTeams SET win = win + 1 WHERE teamId = ?

-- update draw;
UPDATE leagueTeams SET draw = draw + 1 WHERE teamId = ?

-- get completed match;
SELECT t1.teamName AS teamOneName, t2.teamName AS teamTwoName, t1.teamLogo as teamOneLogo, t2.teamLogo as teamTwoLogo, m.matchRound as matchRound, m.scoreOne as scoreOne, m.scoreTwo as scoreTwo, m.matchId as matchId
    FROM matches m
    JOIN teams t1 ON m.teamOneId = t1.teamId
    JOIN teams t2 ON m.teamTwoId = t2.teamId
    WHERE m.leagueId = ? and m.status="completed"
    order by m.matchRound

-- delete match;
DELETE FROM matches WHERE matchId = ?

-- players
-- add players;
INSERT INTO players (playerName, playerImage, playerDOB, playerPosition) VALUES (?, ?, ?, ?);

-- get all players;
SELECT * FROM players;


-- get single player;

SELECT * FROM players WHERE playerId = ?

-- edit single player;
UPDATE players
    SET playerName = ?,
        playerImage = ?,
        playerPosition = ?
    WHERE playerId = ?;

-- search by player name;
SELECT * FROM players WHERE playerName LIKE ?;

-- delete player by id;
DELETE FROM players WHERE playerId = ?;

-- search player;
SELECT playerId, playerName, playerImage, playerDOB, playerAge
    FROM players
    WHERE playerName LIKE ?;

-- point table;
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
    teamName ASC;

-- team matches;
SELECT
                    t1.teamName AS teamOneName,
                    t2.teamName AS teamTwoName,
                    t1.teamLogo AS teamOneLogo,
                    t2.teamLogo AS teamTwoLogo,
                    m.matchId,
                    m.teamOneId,
                    m.teamTwoId,
                    m.scoreOne,
                    m.scoreTwo,
                    l.leagueName
                FROM matches m
                JOIN teams t1 ON m.teamOneId = t1.teamId
                JOIN teams t2 ON m.teamTwoId = t2.teamId
                JOIN leagues l ON m.leagueId = l.leagueId
                WHERE m.teamOneId = ? OR m.teamTwoId = ?;

-- get team players;
SELECT *
    FROM teamPlayers
    JOIN players ON teamPlayers.playerId = players.playerId
    WHERE teamPlayers.teamId = ?

-- delete team Players;
DELETE FROM teamPlayers WHERE teamPlayerId = ?;

-- checking if the player is belongs to another team or not before adding to a team;
SELECT * FROM teamPlayers WHERE playerId = ?

-- add team player;
INSERT INTO teamPlayers (playerId, teamId) VALUES (?, ?);

-- winners;
-- checking duplicate before adding a league winner;
INSERT INTO teamPlayers (playerId, teamId) VALUES (?, ?)

-- adding winners
INSERT INTO winners (leagueId, teamId) VALUES (?, ?);

-- delete a winner;
DELETE FROM winners WHERE leagueId = ?;

-- get a winner details;
SELECT *
    FROM winners
    INNER JOIN teams ON winners.teamId = teams.teamId
    INNER JOIN leagues ON winners.leagueId = leagues.leagueId
    WHERE winners.teamId = ?;



-- creating a view for point table generation
