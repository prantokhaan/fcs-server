-- users
create table users(
    user varchar(20) primary key,
    password varchar(30) not null,
    role varchar(10) not null
);

--teams,
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

--leagues,
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
    FOREIGN key(teamOneId) REFERENCES teams(teamId) ON DELETE CASCADE
);