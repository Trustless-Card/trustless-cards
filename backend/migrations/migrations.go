package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	_ "github.com/tursodatabase/libsql-client-go/libsql"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}

	databaseURL := os.Getenv("TURSO_DATABASE_URL")
	authToken := os.Getenv("TURSO_AUTH_TOKEN")

	url := fmt.Sprintf("%s?authToken=%s", databaseURL, authToken)

	db, err := sql.Open("libsql", url)
	if err != nil {
		log.Fatalf("Failed to open database: %v", err)
	}
	defer db.Close()

	err = createUsersTable(db)
	if err != nil {
		log.Fatalf("Failed to execute migration: %v", err)
	}

	err = createMatchTable(db)
	if err != nil {
		log.Fatalf("Failed to execute migration: %v", err)
	}

	err = createMatchUsersTable(db)
	if err != nil {
		log.Fatalf("Failed to execute migration: %v", err)
	}

	log.Println("Migrations applied successfully")
}

func createUsersTable(db *sql.DB) error {
	query := `
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        public_addr TEXT NOT NULL,
        balance REAL NOT NULL
    );
    `
	_, err := db.Exec(query)
	if err != nil {
		return fmt.Errorf("Failed to create users table: %w", err)
	}
	return nil
}

func createMatchTable(db *sql.DB) error {
	query := `
    CREATE TABLE IF NOT EXISTS match (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        game_type TEXT NOT NULL
    );
    `
	_, err := db.Exec(query)
	if err != nil {
		return fmt.Errorf("Failed to create match table: %w", err)
	}
	return nil
}

func createMatchUsersTable(db *sql.DB) error {
	query := `
    CREATE TABLE IF NOT EXISTS match_users (
        match_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        balance_match REAL NOT NULL,
        FOREIGN KEY (match_id) REFERENCES match(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
    );
    `
	_, err := db.Exec(query)
	if err != nil {
		return fmt.Errorf("Failed to create match_users table: %w", err)
	}
	return nil
}
