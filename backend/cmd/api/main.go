// This implementation is for a future implementation of an online game.
// For now, the online features will not be used. Code related to
// match users functionality is commented out for future use.

package main

import (
	"log"

	"dapp/db"
	"dapp/handlers"
	"dapp/storage"

	"github.com/gofiber/fiber/v2"
	_ "github.com/tursodatabase/libsql-client-go/libsql"
)

func main() {
	// Connect to the database
	db, err := db.Connect()
	if err != nil {
		log.Fatalf("Could not connect to the database: %v", err)
	}
	defer db.Close()

	// Initialize Fiber app
	app := fiber.New()

	// Health check endpoint
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"status": "ok"})
	})

	// Initialize user handlers and storage
	userStorage := storage.NewUserStorage(db)
	userHandler := handlers.NewUserHandler(userStorage)

	// User routes
	userGroup := app.Group("/users")
	userGroup.Get("/me", userHandler.GetUsers)

	// Initialize match handlers and storage
	matchStorage := storage.NewMatchStorage(db)
	matchHandler := handlers.NewMatchHandler(matchStorage)

	// Initialize match user handlers and storage (commented out for future use)
	// matchUserStorage := storage.NewMatchUserStorage(db)
	// matchUserHandler := handlers.NewMatchUserHandler(matchUserStorage)

	// Match routes (commented out for future use)
	matchGroup := app.Group("/matches")
	matchGroup.Get("/all", matchHandler.GetMatches)

	// Routes related to match users (commented out for future use)
	// matchUserGroup := app.Group("/matchusers")
	// matchUserGroup.Post("/add", matchUserHandler.AddUserToMatch)
	// matchUserGroup.Get("/:userID/match/:matchID", matchUserHandler.GetMatchesForUser)

	// Start server
	app.Listen(":6969")
}

