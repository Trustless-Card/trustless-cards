package handlers

import (
    "dapp/storage"
    "github.com/gofiber/fiber/v2"
)

type MatchHandler struct {
    Storage *storage.MatchStorage
}

func NewMatchHandler(storage *storage.MatchStorage) *MatchHandler {
    return &MatchHandler{
        Storage: storage,
    }
}

func (h *MatchHandler) GetMatches(c *fiber.Ctx) error {
    matches, err := h.Storage.GetMatches()
    if err != nil {
        return c.JSON(fiber.Map{"error": err.Error()})
    }

    return c.JSON(matches)
}

