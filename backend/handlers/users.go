// This implementation is for a future implementation of an online game.
// For now, the online features will not be used. Code related to
// match users functionality is commented out for future use.

package handlers

import (
	"dapp/storage"
	"github.com/gofiber/fiber/v2"
)

type UserHandler struct {
	Storage *storage.UserStorage
}

func NewUserHandler(storage *storage.UserStorage) *UserHandler {
	return &UserHandler{
		Storage: storage,
	}
}

func (h *UserHandler) GetUsers(c *fiber.Ctx) error {
	users, err := h.Storage.GetUsers()
	if err != nil {
		return c.JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(users)
}
