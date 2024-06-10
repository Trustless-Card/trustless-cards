package storage

import (
	"database/sql"

	"github.com/Trustless-Card/trustless-cards/types"
)

type UserStorage struct {
	db *sql.DB
}

func NewUserStorage(db *sql.DB) *UserStorage {
	return &UserStorage{db: db}
}

func (s *UserStorage) CreateUser(user types.User) error {
	_, err := s.db.Exec("INSERT INTO users (username, public_addr, balance) VALUES (?, ?, ?)",
		user.Username, user.PublicAddr, user.Balance,
	)
	return err
}

func (s *UserStorage) GetUsers() ([]types.User, error) {
    rows, err := s.db.Query("SELECT id, username, public_addr, balance FROM users ORDER BY id ASC")
    if err != nil {
        return nil, err
    }
    
    var users []types.User
    for rows.Next() {
        var user types.User
        if err := rows.Scan(&user.ID, &user.Username, &user.PublicAddr, &user.Balance); err != nil {
            return nil, err
        }
        users = append(users, user)
    }

    return users, nil
}
