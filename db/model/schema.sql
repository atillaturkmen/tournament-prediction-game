BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "account" (
	"id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	"username"	TEXT NOT NULL UNIQUE,
	"password"	TEXT NOT NULL,
	"points"	INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS "champion_guess" (
	"tournament_name"	TEXT NOT NULL,
	"user_id"	TEXT NOT NULL,
	"champion"	TEXT NOT NULL,
	FOREIGN KEY("tournament_name") REFERENCES "tournament"("name"),
	PRIMARY KEY("tournament_name","user_id"),
	FOREIGN KEY("user_id") REFERENCES "account"("id")
);
CREATE TABLE IF NOT EXISTS "top_scorer_guess" (
	"tournament_name"	TEXT NOT NULL,
	"user_id"	TEXT NOT NULL,
	"top_scorer"	TEXT NOT NULL,
	PRIMARY KEY("tournament_name","user_id"),
	FOREIGN KEY("tournament_name") REFERENCES "tournament"("name"),
	FOREIGN KEY("user_id") REFERENCES "account"("id")
);
CREATE TABLE IF NOT EXISTS "score_guess" (
	"match_id"	TEXT NOT NULL,
	"user_id"	TEXT NOT NULL,
	"home_goals"	INTEGER NOT NULL,
	"away_goals"	INTEGER NOT NULL,
	FOREIGN KEY("match_id") REFERENCES "match"("id"),
	PRIMARY KEY("match_id","user_id"),
	FOREIGN KEY("user_id") REFERENCES "account"("id")
);
CREATE TABLE IF NOT EXISTS "match" (
	"id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	"name"	TEXT NOT NULL,
	"time"	TEXT NOT NULL,
	"home_goals"	INTEGER,
	"away_goals"	INTEGER,
	"in_tournament"	TEXT,
	FOREIGN KEY("in_tournament") REFERENCES "tournament"("name")
);
CREATE TABLE IF NOT EXISTS "tournament" (
	"name"	TEXT NOT NULL UNIQUE,
	"champion"	TEXT,
	"top_scorer"	TEXT,
	PRIMARY KEY("name")
);
COMMIT;