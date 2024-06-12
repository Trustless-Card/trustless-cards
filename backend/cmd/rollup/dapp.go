package main

import (
	"context"
	"fmt"
	"log/slog"

	"github.com/rollmelette/rollmelette"
)

type TrustlessCards struct{}

func (a *TrustlessCards) Advance(
	env rollmelette.Env,
	metadata rollmelette.Metadata,
	deposit rollmelette.Deposit,
	payload []byte,
) error {
	deck := shuffleDeck()
	env.Notice([]byte(fmt.Sprintf("meu deck %v",deck)))
	// Handle advance input
	return nil
}

func (a *TrustlessCards) Inspect(env rollmelette.EnvInspector, payload []byte) error {
	// Handle inspect input
	return nil
}

func shuffleDeck() [52]int {
	// Criando o baralho inicial
	seed := 12012
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

func main() {
	ctx := context.Background()
	opts := rollmelette.NewRunOpts()
	app := new(TrustlessCards)
	err := rollmelette.Run(ctx, opts, app)
	if err != nil {
		slog.Error("application error", "error", err)
	}
}
