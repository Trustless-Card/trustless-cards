// This implementation is for a future implementation of an online game.
// For now, the online features will not be used. Code related to
// match users functionality is commented out for future use.

package storage

import (
    "database/sql"

    "dapp/types"
)

type MatchUserStorage struct {
    db *sql.DB
}

func NewMatchUserStorage(db *sql.DB) *MatchUserStorage {
    return &MatchUserStorage{db: db}
}

func (s *MatchUserStorage) AddUserToMatch(matchUser types.MatchUsers) error {
    _, err := s.db.Exec("INSERT INTO match_users (match_id, user_id, balance_match) VALUES (?, ?, ?)",
        matchUser.MatchID, matchUser.UserID, matchUser.BalanceMatch,
    )
    return err
}

func (s *MatchUserStorage) GetMatchesForUser(userID, matchID int) ([]types.MatchUsers, error) {
    query := `
    SELECT match_id, user_id, balance_match
    FROM match_users
    WHERE user_id = ? AND match_id = ?
    `

    rows, err := s.db.Query(query, userID, matchID)
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    var matchUsers []types.MatchUsers
    for rows.Next() {
        var matchUser types.MatchUsers
        if err := rows.Scan(&matchUser.MatchID, &matchUser.UserID, &matchUser.BalanceMatch); err != nil {
            return nil, err
        }
        matchUsers = append(matchUsers, matchUser)
    }
    if err := rows.Err(); err != nil {
        return nil, err
    }

    return matchUsers, nil
}

