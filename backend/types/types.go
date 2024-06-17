// This implementation is for a future implementation of an online game.
// For now, the online features will not be used. Code related to
// match users functionality is commented out for future use.

package types

type User struct {
	ID         int
	Username   string
	PublicAddr string
	Balance    float32
}

type Match struct {
	ID       int
	GameType string
}

type MatchUsers struct {
	MatchID      int
	UserID       int
	BalanceMatch float32
}
