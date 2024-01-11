use sql12676206;


CALL EnableForeignKeys;


create table users(
    user varchar(20) primary key,
    password varchar(30) not null,
    role varchar(10) not null
);


create table teams(
    teamId int primary key auto_increment,
    teamName varchar(30) not null unique,
    teamLogo varchar(500) unique,
    teamRating int not null
);

CREATE INDEX idx_teamName on teams(teamName);
CREATE INDEX idx_teamId on teams(teamId);
CREATE INDEX idx_teamLogo on teams(teamLogo);
CREATE INDEX idx_teamRating on teams(teamRating);


create table leagues(
    leagueId int primary key AUTO_INCREMENT,
    leagueName varchar(30) not null unique,
    leagueType varchar(20) not null,
    leagueNoOfTeams int not null,
    leagueStatus varchar(20)
);

CREATE INDEX idx_leagueName ON leagues (leagueName);
CREATE INDEX idx_leagueId ON leagues (leagueId);
CREATE INDEX idx_leagueStatus ON leagues (leagueStatus);
CREATE INDEX idx_leagueType ON leagues (leagueType);
CREATE INDEX idx_leagueNoOfTeams ON leagues (leagueNoOfTeams);

-- leagueTeams
create table leagueTeams(
    leagueTeamId int AUTO_INCREMENT PRIMARY KEY,
    leagueId int,
    teamId int,
    played int,
    win int,
    draw int,
    lose int,
    gf int,
    ga int,
    foreign key(leagueId) REFERENCES leagues(leagueId) ON DELETE CASCADE,
    FOREIGN KEY(teamId) REFERENCES teams(teamId) ON DELETE CASCADE
);

-- matches,
create table matches(
    matchId int PRIMARY KEY AUTO_INCREMENT,
    leagueId int,
    teamOneId int,
    teamTwoId int,
    scoreOne int,
    scoreTwo int,
    matchRound int,
    status varchar(10),
    FOREIGN KEY(leagueId) REFERENCES leagues(leagueId) ON DELETE CASCADE,
    FOREIGN KEY(teamOneId) REFERENCES teams(teamId) ON DELETE CASCADE,
    FOREIGN key(teamTwoId) REFERENCES teams(teamId) ON DELETE CASCADE
);

-- players
create table players(
    playerId int AUTO_INCREMENT PRIMARY key,
    playerName varchar(50) not null,
    playerImage varchar(500),
    playerPosition enum("Forward", "Midfielder", "Defender", "Goalkeeper"),
    playerDOB date,
    playerAge int
);

create table teamPlayers(
    teamPlayerId int AUTO_INCREMENT PRIMARY KEY,
    playerId int,
    teamId int,
    FOREIGN KEY(playerId) REFERENCES players(playerId) on DELETE CASCADE,
    FOREIGN KEY(teamId) REFERENCES teams(teamId) on DELETE CASCADE
);

create table winners(
    winnersId int AUTO_INCREMENT PRIMARY key,
    leagueId int,
    teamId int,
    FOREIGN KEY(teamId) REFERENCES teams(teamId) ON DELETE CASCADE,
    FOREIGN KEY(leagueId) REFERENCES leagues(leagueId) ON DELETE CASCADE
);

drop table winners;



-- For the leagues table
CREATE INDEX idx_leagueName_NoOfTeams ON leagues (leagueName, leagueNoOfTeams);

-- For the matches table
CREATE INDEX idx_matchTeams_Round_Status ON matches (teamOneId, teamTwoId, matchRound, status);

-- For the teamPlayers table
CREATE INDEX idx_teamPlayer_PlayerTeam ON teamPlayers (playerId, teamId);

-- For the teams table
CREATE INDEX idx_teamRating_Name ON teams (teamRating, teamName);

-- For the leagueTeams table
CREATE INDEX idx_leagueTeam_Stats ON leagueTeams (leagueId, teamId, played, win, draw, lose, gf, ga);

-- For the matches table
CREATE INDEX idx_matchTeams_Scores ON matches (teamOneId, teamTwoId, scoreOne, scoreTwo);

-- For the players table
CREATE INDEX idx_playerDOB_Age ON players (playerDOB, playerAge);

-- For the teamPlayers table
CREATE INDEX idx_teamPlayer_TeamPlayer ON teamPlayers (teamId, playerId);


-- For the leagues table
CREATE INDEX idx_leagueType_NoOfTeams ON leagues (leagueType, leagueNoOfTeams);

-- For the teamPlayers table
CREATE INDEX idx_teamPlayer_PlayerTeamId ON teamPlayers (playerId, teamId);

-- For the players table
CREATE INDEX idx_playerAge_Name ON players (playerAge, playerName);

-- For the leagueTeams table
CREATE INDEX idx_leagueTeam_WinsLoses ON leagueTeams (win, lose);

-- For the teams table
CREATE INDEX idx_teamLogo_Rating ON teams (teamLogo, teamRating);

-- For the leagues table
CREATE INDEX idx_leagueName_Status ON leagues (leagueName, leagueStatus);


-- For the teamPlayers table
CREATE INDEX idx_teamPlayer_TeamPlayerId_PlayerId ON teamPlayers (teamId, playerId);

-- For the players table
CREATE INDEX idx_playerAge_Image ON players (playerAge, playerImage);

-- For the leagueTeams table
CREATE INDEX idx_leagueTeam_Results ON leagueTeams (played, win, draw, lose, gf, ga);

-- For the teams table
CREATE INDEX idx_teamRating_Name_Logo ON teams (teamRating, teamName, teamLogo);



DELIMITER //

CREATE PROCEDURE FilterTeams (
    IN filterType VARCHAR(30)
)
BEGIN
    -- For name ascending
    IF filterType = 'name_asc' THEN
        SELECT * FROM teams ORDER BY teamName ASC;
    END IF;

    -- For name descending
    IF filterType = 'name_desc' THEN
        SELECT * FROM teams ORDER BY teamName DESC;
    END IF;

    -- For rating ascending
    IF filterType = 'rating_asc' THEN
        SELECT * FROM teams ORDER BY teamRating ASC;
    END IF;

    -- For rating descending
    IF filterType = 'rating_desc' THEN
        SELECT * FROM teams ORDER BY teamRating DESC;
    END IF;
END //

DELIMITER ;

CALL FilterTeams('name_desc');

DROP PROCEDURE IF EXISTS FilterPlayers;

CREATE PROCEDURE FilterPlayers (
    IN filterType VARCHAR(30)
)
BEGIN
    -- For name ascending
    IF filterType = 'name_asc' THEN
        SELECT * FROM players ORDER BY playerName ASC;
    END IF;

    -- For name descending
    IF filterType = 'name_desc' THEN
        SELECT * FROM players ORDER BY playerName DESC;
    END IF;

    -- For age ascending
    IF filterType = 'age_asc' THEN
        SELECT * FROM players ORDER BY playerAge ASC;
    END IF;

    -- For age descending
    IF filterType = 'age_desc' THEN
        SELECT * FROM players ORDER BY playerAge DESC;
    END IF;

    IF filterType = 'forward' THEN
        SELECT * FROM players WHERE `playerPosition` = 'forward';
    END IF;

    IF filterType = 'midfielder' THEN
        SELECT * FROM players WHERE `playerPosition` = 'midfielder';
    END IF;

    IF filterType = 'defender' THEN
        SELECT * FROM players WHERE `playerPosition` = 'defender';
    END IF;

    IF filterType = 'goalkeeper' THEN
        SELECT * FROM players WHERE `playerPosition` = 'goalkeeper';
    END IF;
END //





