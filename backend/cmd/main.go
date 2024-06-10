package main

import (
	"log"

	"github.com/Trustless-Card/trustless-cards/db"
	"github.com/Trustless-Card/trustless-cards/handlers"
	"github.com/Trustless-Card/trustless-cards/storage"

	"github.com/gofiber/fiber/v2"
	_ "github.com/tursodatabase/libsql-client-go/libsql"
)

func main() {
	db, err := db.Connect()
	if err != nil {
		log.Fatalf("Could not connect to the database: %v", err)
	}
	defer db.Close()

	app := fiber.New()

	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"status": "ok"})
	})

    userStorage := storage.NewUserStorage(db)
    userHandler := handlers.NewUserHandler(userStorage)

    userGroup := app.Group("/users")
    userGroup.Get("/me", userHandler.GetUsers)

	app.Listen(":6969")
}
