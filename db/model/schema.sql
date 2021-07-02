BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "admin" (
	"id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	"user_id"	INTEGER NOT NULL UNIQUE,
	FOREIGN KEY("user_id") REFERENCES "user"("id")
);
CREATE TABLE IF NOT EXISTS "tournament" (
	"name"	TEXT NOT NULL UNIQUE,
	"champion"	TEXT,
	"top_scorer"	TEXT,
	PRIMARY KEY("name")
);
CREATE TABLE IF NOT EXISTS "top_scorer_guess" (
	"tournament_name"	TEXT NOT NULL,
	"user_id"	TEXT NOT NULL,
	"top_scorer"	TEXT NOT NULL,
	PRIMARY KEY("tournament_name","user_id"),
	FOREIGN KEY("tournament_name") REFERENCES "tournament"("name"),
	FOREIGN KEY("user_id") REFERENCES "user"("id")
);
CREATE TABLE IF NOT EXISTS "champion_guess" (
	"tournament_name"	TEXT NOT NULL,
	"user_id"	TEXT NOT NULL,
	"champion"	TEXT NOT NULL,
	FOREIGN KEY("tournament_name") REFERENCES "tournament"("name"),
	PRIMARY KEY("tournament_name","user_id"),
	FOREIGN KEY("user_id") REFERENCES "user"("id")
);
CREATE TABLE IF NOT EXISTS "user" (
	"id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	"username"	TEXT NOT NULL UNIQUE,
	"password"	TEXT NOT NULL,
	"points"	INTEGER NOT NULL DEFAULT 0,
	"correct_winner_guesses"	INTEGER NOT NULL DEFAULT 0,
	"correct_score_guesses"	INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS "team" (
	"name"	TEXT NOT NULL,
	"logo"	TEXT NOT NULL,
	PRIMARY KEY("name")
);
CREATE TABLE IF NOT EXISTS "match" (
	"id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	"home_team"	TEXT NOT NULL,
	"away_team"	TEXT NOT NULL,
	"time"	TEXT,
	"home_goals_first_half"	INTEGER,
	"home_goals_full_time"	INTEGER,
	"away_goals_first_half"	INTEGER,
	"away_goals_full_time"	INTEGER,
	"in_tournament"	TEXT,
	FOREIGN KEY("in_tournament") REFERENCES "tournament"("name"),
	FOREIGN KEY("home_team") REFERENCES "team"("name"),
	FOREIGN KEY("away_team") REFERENCES "team"("name")
);
CREATE TABLE IF NOT EXISTS "score_guess" (
	"match_id"	TEXT NOT NULL,
	"user_id"	TEXT NOT NULL,
	"home_goals_first_half"	INTEGER,
	"home_goals_full_time"	INTEGER NOT NULL,
	"away_goals_first_half"	INTEGER,
	"away_goals_full_time"	INTEGER NOT NULL,
	FOREIGN KEY("match_id") REFERENCES "match"("id"),
	PRIMARY KEY("match_id","user_id"),
	FOREIGN KEY("user_id") REFERENCES "user"("id")
);
COMMIT;
