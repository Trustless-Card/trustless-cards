// This implementation is for a future implementation of an online game.
// For now, the online features will not be used. Code related to
// match users functionality is commented out for future use.

package storage

import (
    "database/sql"

    "dapp/types"
)

type MatchStorage struct {
    db *sql.DB
}

func NewMatchStorage(db *sql.DB) *MatchStorage {
    return &MatchStorage{db: db}
}

func (s *MatchStorage) CreateMatch(match types.Match) error {
    _, err := s.db.Exec("INSERT INTO match (game_type) VALUES (?)", match.GameType)
    return err
}

func (s *MatchStorage) GetMatches() ([]types.Match, error) {
    rows, err := s.db.Query("SELECT id, game_type FROM match ORDER BY id ASC")
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    var matches []types.Match
    for rows.Next() {
        var match types.Match
        if err := rows.Scan(&match.ID, &match.GameType); err != nil {
            return nil, err
        }
        matches = append(matches, match)
    }
    if err := rows.Err(); err != nil {
        return nil, err
    }

    return matches, nil
}

