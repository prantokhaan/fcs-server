use football_competition_simulator;

create table user(
    user varchar(20) primary key,
    password varchar(30) not null,
    role varchar(10) not null
);

insert into user(user, password, role)
VALUES
    ("pranto", "pranto", "user");

drop table user;

select * from user;

create table teams(
    teamId int primary key auto_increment,
    teamName varchar(30) not null unique,
    teamLogo varchar(500) unique,
    teamRating int not null
);

drop table teams;

select * from teams;

create table leagues(
    leagueId int primary key AUTO_INCREMENT,
    leagueName varchar(30) not null unique,
    leagueType varchar(20) not null,
    leagueNoOfTeams int not null,
    leagueStatus enum("running", "completed")
);

ALTER TABLE leagues
MODIFY COLUMN leagueStatus VARCHAR(20);

insert into leagues(leagueName, leagueType, leagueNoOfTeams, leagueStatus)
VALUES
    ("BPL", "League", 20, "Finished");

select * from leagues;

drop table leagues;

truncate leagues;



create table leagueTeams(
    leagueId int,
    teamId int,
    played int,
    win int,
    draw int,
    lose int,
    gf int,
    ga int,
    foreign key(leagueId) REFERENCES leagues(leagueId),
    FOREIGN KEY(teamId) REFERENCES teams(teamId)
);

ALTER TABLE leagueTeams
ADD COLUMN leagueTeamId INT AUTO_INCREMENT PRIMARY KEY FIRST;


truncate leagueTeams;

select * from leagueTeams;

insert into leagueTeams(leagueId, teamId)
values (2, 1);

select count(*) from leagueTeams where leagueId = 1;

select * from leagueTeams;

select t.teamName, t.teamId
from leagueTeams as l
join teams as t
on l.teamId = t.teamId
where leagueId = 1;


delete from leagueTeams
where teamId = 9 and leagueId = 1;


delete from leagues where leagueId=3;

select * from matches;



delete from leagueTeams where leagueId = 1;

ALTER TABLE matches 
  DROP FOREIGN KEY matches_ibfk_3;

  ALTER TABLE matches
  ADD FOREIGN KEY (teamTwoId) REFERENCES teams(teamId) ON DELETE CASCADE;


  delete from teams where teamId = 6;

  delete from matches where matchId = 10;

  select * from teams;

drop table leagueTeams;

TRUNCATE leagueTeams;


SELECT t.teamId, t.teamName, t.teamLogo,
    SUM(lt.win * 3 + lt.draw*1) AS points,
    SUM(lt.gf - lt.ga) AS goalDifference,
    SUM(lt.gf) AS goalsFor,
    SUM(lt.ga) AS goalsAgainst,
    SUM(
        CASE 
            WHEN m.teamOneId = lt.teamId AND m.scoreOne > m.scoreTwo THEN 1
            WHEN m.teamTwoId = lt.teamId AND m.scoreTwo > m.scoreOne THEN 1
            ELSE 0
        END
    ) AS wins,
    SUM(lt.draw) AS draws,
    SUM(lt.lose) AS loses,
    SUM(lt.played) AS played
    FROM teams AS t
    INNER JOIN leagueTeams AS lt ON t.teamId = lt.teamId
    WHERE lt.leagueId = 1
    GROUP BY t.teamId, t.teamName
    ORDER BY 
    points DESC,
    goalDifference DESC,
    goalsFor DESC,
    goalsAgainst ASC,
    wins DESC,
    loses ASC,
    teamName ASC;


select t.teamName, win, t.teamId,
SUM(CASE WHEN lt.win = 1 THEN 3 ELSE 0 END) AS points
from leagueTeams as lt
inner join teams as t
on t.teamId = lt.teamId
group by t.teamId
order by t.teamName;

SELECT
    t.teamId,
    t.teamName,
    t.teamLogo,
    SUM(
        CASE 
            WHEN m.teamOneId = lt.teamId AND m.scoreOne > m.scoreTwo THEN 1
            WHEN m.teamTwoId = lt.teamId AND m.scoreTwo > m.scoreOne THEN 1
            ELSE 0
        END
    ) AS wins,
    SUM(
        CASE 
            WHEN m.teamOneId = lt.teamId OR m.teamTwoId = lt.teamId THEN 1
            ELSE 0
        END
    ) AS played
FROM
    teams AS t
INNER JOIN
    leagueTeams AS lt ON t.teamId = lt.teamId
LEFT JOIN
    matches AS m ON (m.teamOneId = lt.teamId OR m.teamTwoId = lt.teamId) AND m.leagueId = lt.leagueId
WHERE
    lt.leagueId = 1
    AND t.teamId = specificTeamId
GROUP BY
    t.teamId, t.teamName, t.teamLogo
ORDER BY 
    wins DESC;



update leagueTeams
set win = 1
where teamId = 1;


-- matches 
create table matches(
    matchId int PRIMARY KEY AUTO_INCREMENT,
    leagueId int,
    teamOneId int,
    teamTwoId int,
    scoreOne int,
    scoreTwo int,
    matchRound int,
    status varchar(10),
    FOREIGN KEY(leagueId) REFERENCES leagues(leagueId),
    FOREIGN KEY(teamOneId) REFERENCES teams(teamId),
    FOREIGN key(teamOneId) REFERENCES teams(teamId)
);

insert into matches(leagueId, teamOneId, teamTwoId)
VALUES
    (1, 1, 5);

SELECT m.*, t1.teamName AS teamOneName, t2.teamName AS teamTwoName
FROM matches m
INNER JOIN teams t1 ON m.teamOneId = t1.teamId
INNER JOIN teams t2 ON m.teamTwoId = t2.teamId;


select * from matches;

drop table matches;

truncate matches;

update matches
set status = "pending"
where matchId = 1;
















-- experiment

select * from matches;

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
    lt.leagueId = 11
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



-- indexing
CREATE INDEX idx_leagueName ON leagues (leagueName);
CREATE INDEX idx_leagueId ON leagues (leagueId);
CREATE INDEX idx_leagueStatus ON leagues (leagueStatus);
CREATE INDEX idx_leagueType ON leagues (leagueType);
CREATE INDEX idx_leagueNoOfTeams ON leagues (leagueNoOfTeams);

-- teams indexing
CREATE INDEX idx_teamName on teams(teamName);
CREATE INDEX idx_teamId on teams(teamId);
CREATE INDEX idx_teamLogo on teams(teamLogo);
CREATE INDEX idx_teamRating on teams(teamRating);

show index from teams;

select * from teams;