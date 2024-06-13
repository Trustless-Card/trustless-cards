// package main
//
// import (
// 	"context"
// 	"fmt"
// 	"log/slog"
//
// 	"github.com/rollmelette/rollmelette"
// 	"github.com/ethereum/go-ethereum/common"
// )
//
// type TrustlessCards struct{
// 	Sender common.Address
// }
//
//
//
// func (a *TrustlessCards) Advance(
// 	env rollmelette.Env,
// 	metadata rollmelette.Metadata,
// 	deposit rollmelette.Deposit,
// 	payload []byte,
// ) error {
// 	deck := shuffleDeck()
// 	env.Notice([]byte(fmt.Sprintf("meu deck %v",deck)))
// 	// Handle advance input
// 	return nil
// }
//
// func (a *TrustlessCards) Inspect(env rollmelette.EnvInspector, payload []byte) error {
// 	// Handle inspect input
// 	return nil
// }
//
// func shuffleDeck() [52]int {
// 	// Criando o baralho inicial
// 	seed := 12012
// 	deck := [52]int{}
// 	for i := 0; i < 52; i++ {
// 		deck[i] = i
// 	}
//
// 	// Embaralhando o baralho usando o algoritmo Fisher-Yates
// 	rand := func(n int) int {
// 		// Esta função gera um número pseudoaleatório determinístico com base no seed
// 		return int((seed + int(n)*123456789) % 52)
// 	}
//
// 	for i := 51; i > 0; i-- {
// 		j := rand(i + 1)
// 		deck[i], deck[j] = deck[j], deck[i]
// 	}
// 	return deck
// }
//
//
//
// func main() {
// 	ctx := context.Background()
// 	opts := rollmelette.NewRunOpts()
// 	app := new(TrustlessCards)
// 	err := rollmelette.Run(ctx, opts, app)
// 	if err != nil {
// 		slog.Error("application error", "error", err)
// 	}
// }

package main

import (
	"context"
	"encoding/json"
	"fmt"
	"math/big"

	"github.com/ethereum/go-ethereum/common"
	"github.com/rollmelette/rollmelette"
)

// TrustlessCards representa o contrato
type TrustlessCards struct {
	Balances map[common.Address]*big.Int
}

// NewTrustlessCards inicializa uma nova instância de TrustlessCards
func NewTrustlessCards() *TrustlessCards {
	return &TrustlessCards{
		Balances: make(map[common.Address]*big.Int),
	}
}

// Payload estrutura para determinar o tipo de operação
type Payload struct {
	Method string         `json:"method"`
	From   common.Address `json:"from"`
	ERC20  common.Address `json:"erc20"`
	Amount *big.Int       `json:"amount"`
}

// Advance processa entradas (inputs) com base no tipo de payload
func (a *TrustlessCards) Advance(
	env rollmelette.Env,
	metadata rollmelette.Metadata,
	deposit rollmelette.Deposit,
	payload []byte,
) error {
	// Decodificando o payload JSON
	var input Payload
	if err := json.Unmarshal(payload, &input); err != nil {
		return fmt.Errorf("failed to unmarshal payload: %w", err)
	}

	switch input.Method {
	case "deposit":
		// Criando um depósito com base nas informações do payload
		ethDeposit := &rollmelette.EtherDeposit{
			Sender: input.From,
			Value:  input.Amount,
		}
		if _, exists := a.Balances[ethDeposit.Sender]; !exists {
			a.Balances[ethDeposit.Sender] = big.NewInt(0)
		}
		a.Balances[ethDeposit.Sender].Add(a.Balances[ethDeposit.Sender], ethDeposit.Value)
		fmt.Printf("Deposit successful: sender=%s, value=%s ETH\n", ethDeposit.Sender.Hex(), ethDeposit.Value.String())

		deck := shuffleDeck()
		env.Notice([]byte(fmt.Sprintf("meu deck %v", deck)))

	case "withdraw":
		if err := a.withdraw(env, metadata); err != nil {
			return err
		}
		deck := shuffleDeck()
		env.Notice([]byte(fmt.Sprintf("meu deck %v", deck)))
		
	default:
		return fmt.Errorf("unknown method: %s", input.Method)
	}

	a.Inspect(env, nil)
	return nil
}

// Inspect emite um relatório de saldo para todos os endereços
func (a *TrustlessCards) Inspect(env rollmelette.EnvInspector, payload []byte) error {
	// Emit balance report for all addresses
	for addr, balance := range a.Balances {
		env.Report(append(addr.Bytes(), balance.FillBytes(make([]byte, 32))...))
	}
	return nil
}

// withdraw processa um saque de Ether
func (a *TrustlessCards) withdraw(env rollmelette.Env, metadata rollmelette.Metadata) error {
	sender := metadata.MsgSender
	balance, exists := a.Balances[sender]
	if !exists || balance.Sign() == 0 {
		return fmt.Errorf("nothing to withdraw")
	}
	_, err := env.EtherWithdraw(sender, balance)
	if err != nil {
		return err
	}
	fmt.Printf("Withdrawn: sender=%s, value=%s ETH\n", sender.Hex(), balance.String())
	a.Balances[sender] = big.NewInt(0)
	return nil
}

// shuffleDeck embaralha o baralho de cartas
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
	app := NewTrustlessCards()
	err := rollmelette.Run(ctx, opts, app)
	if err != nil {
		fmt.Printf("Application error: %v\n", err)
	}
}

