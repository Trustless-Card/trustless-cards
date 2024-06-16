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
	Amount string         `json:"amount"`
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

	amount := new(big.Int)
	if _, success := amount.SetString(input.Amount, 10); !success {
		return fmt.Errorf("failed to parse amount: %s", input.Amount)
	}

	switch input.Method {
	case "deposit":
		// Implementação do depósito
		fixedERC20 := common.HexToAddress("0xab7528bb862fb57e8a2bcd567a2e929a0be56a5e")

		if _, exists := a.Balances[fixedERC20]; !exists {
			a.Balances[fixedERC20] = big.NewInt(0)
		}
		a.Balances[fixedERC20].Add(a.Balances[fixedERC20], amount)
		fmt.Printf("Deposit successful: from=%s, to=%s, value=%s ETH\n", input.From.Hex(), fixedERC20.Hex(), amount.String())

		deck := shuffleDeck(amount)
		env.Notice([]byte(fmt.Sprintf("meu deck %v", deck)))

	case "withdraw":
		// Implementação do saque
		fixedERC20 := common.HexToAddress("0xab7528bb862fb57e8a2bcd567a2e929a0be56a5e")

		balance, exists := a.Balances[fixedERC20]
		if !exists || balance.Sign() == 0 || balance.Cmp(amount) < 0 {
			return fmt.Errorf("insufficient balance or nothing to withdraw")
		}

		// Deduzir o valor do saldo
		a.Balances[fixedERC20].Sub(a.Balances[fixedERC20], amount)
		fmt.Printf("Withdrawn: from=%s, to=%s, value=%s ETH\n", fixedERC20.Hex(), input.From.Hex(), amount.String())

		env.Notice([]byte(fmt.Sprintf("withdrawn %v", amount)))

	case "shambles":
		// Executar a função de embaralhar o deck com base no amount como seed
		deck := shuffleDeck(amount)
		env.Notice([]byte(fmt.Sprintf("meu deck %v", deck)))

	default:
		return fmt.Errorf("unknown method: %s", input.Method)
	}

	// Emitindo relatório de saldo
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

// shuffleDeck embaralha o baralho de cartas com base no amount como seed
func shuffleDeck(amount *big.Int) [52]int {
	// Convertendo amount para um valor inteiro para usar como seed
	seed := int(amount.Int64())

	deck := [52]int{}
	for i := 0; i < 52; i++ {
		deck[i] = i
	}

	// Embaralhando o baralho usando o algoritmo Fisher-Yates
	rand := func(n int) int {
		return (seed + n*123456789) % 52
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

