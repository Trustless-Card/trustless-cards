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

    matchStorage := storage.NewMatchStorage(db)
    matchHandler := handlers.NewMatchHandler(matchStorage)

    matchUserStorage := storage.NewMatchUserStorage(db)
    matchUserHandler := handlers.NewMatchUserHandler(matchUserStorage)

    matchGroup := app.Group("/matches")
    matchGroup.Get("/all", matchHandler.GetMatches)

    matchUserGroup := app.Group("/matchusers")
    matchUserGroup.Post("/add", matchUserHandler.AddUserToMatch)
    matchUserGroup.Get("/:userID/match/:matchID", matchUserHandler.GetMatchesForUser)

    app.Listen(":6969")
}


func shuffleDeck(seed int) [52]int {
	// Criando o baralho inicial
	deck := [52]int{}
	for i := 0; i < 52; i++ {
		deck[i] = i
	}

	// Embaralhando o baralho usando o algoritmo Fisher-Yates
	rand := func(n int) int {
		// Esta função gera um número pseudoaleatório determinístico com base no seed
		return int((seed + int(n)*123456789) % 52)
	}

	for i := 51; i > 0; i-- {
		j := rand(i + 1)
		deck[i], deck[j] = deck[j], deck[i]
	}
	return deck
}
