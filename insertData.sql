use football_competition_simulator;

INSERT INTO players (playerName, playerImage, playerPosition, playerDOB)
VALUES
  ('Gerard Piqué', 'image_url_pique.jpg', 'Defender', '1987-02-02'),
  ('Frenkie de Jong', 'image_url_dejong.jpg', 'Midfielder', '1997-05-12'),
  ('Marc-André ter Stegen', 'image_url_terstegen.jpg', 'Goalkeeper', '1992-04-30'),
  ('Jordi Mboula', 'image_url_mboula.jpg', 'Forward', '1999-03-16'),
  ('Clement Lenglet', 'image_url_lenglet.jpg', 'Defender', '1995-06-25'),
  ('Erling Haaland', 'image_url_haaland.jpg', 'Forward', '2000-07-21'),
  ('NGolo Kanté', 'image_url_kante.jpg', 'Midfielder', '1991-03-29'),
  ('Hakim Ziyech', 'image_url_ziyech.jpg', 'Midfielder', '1993-03-19'),
  ('Phil Foden', 'image_url_foden.jpg', 'Midfielder', '2000-05-28'),
  ('Ferran Torres', 'image_url_torres.jpg', 'Forward', '2000-02-29'),
  ('Sergio Aguero', 'image_url_aguero.jpg', 'Forward', '1988-06-02'),
  ('Thomas Müller', 'image_url_muller.jpg', 'Forward', '1989-09-13'),
  ('Riyad Mahrez', 'image_url_mahrez.jpg', 'Forward', '1991-02-21'),
  ('Jadon Sancho', 'image_url_sancho.jpg', 'Forward', '2000-03-25'),
  ('Diogo Jota', 'image_url_jota.jpg', 'Forward', '1996-12-04'),
  ('João Cancelo', 'image_url_cancelo.jpg', 'Defender', '1994-05-27'),
  ('Rodri', 'image_url_rodri.jpg', 'Midfielder', '1996-06-22'),
  ('Mason Mount', 'image_url_mount.jpg', 'Midfielder', '1999-01-10'),
  ('Ruben Neves', 'image_url_neves.jpg', 'Midfielder', '1997-03-13'),
  ('Jack Grealish', 'image_url_grealish.jpg', 'Midfielder', '1995-09-10');

  select * from players where `playerId` = 14;