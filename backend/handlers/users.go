package handlers

import (
	"github.com/Trustless-Card/trustless-cards/storage"
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
