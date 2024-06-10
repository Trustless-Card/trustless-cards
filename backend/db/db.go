package db

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
)

func Connect() (*sql.DB, error) {
	err := godotenv.Load()
	if err != nil {
		return nil, fmt.Errorf("error loading .env file: %w", err)
	}

	databaseURL := os.Getenv("TURSO_DATABASE_URL")
	authToken := os.Getenv("TURSO_AUTH_TOKEN")

	url := fmt.Sprintf("%s?authToken=%s", databaseURL, authToken)

	db, err := sql.Open("libsql", url)
	if err != nil {
		return nil, fmt.Errorf("failed to open db %s: %w", url, err)
	}

    log.Println("DB connection started")

	return db, nil
}
