package handlers

import (
	"dapp/storage"
	"dapp/types"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

type MatchUserHandler struct {
    Storage *storage.MatchUserStorage
}

func NewMatchUserHandler(storage *storage.MatchUserStorage) *MatchUserHandler {
    return &MatchUserHandler{
        Storage: storage,
    }
}

func (h *MatchUserHandler) AddUserToMatch(c *fiber.Ctx) error {
    var matchUser types.MatchUsers
    if err := c.BodyParser(&matchUser); err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
    }

    err := h.Storage.AddUserToMatch(matchUser)
    if err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
    }

    return c.JSON(fiber.Map{"message": "User added to match successfully"})
}

func (h *MatchUserHandler) GetMatchesForUser(c *fiber.Ctx) error {
    userIDStr := c.Params("userID")
    userID, err := strconv.Atoi(userIDStr)
    if err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid user ID"})
    }

    matchesForUser, err := h.Storage.GetMatchesForUser(userID)
    if err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
    }

    return c.JSON(matchesForUser)
}

