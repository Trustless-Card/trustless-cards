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
