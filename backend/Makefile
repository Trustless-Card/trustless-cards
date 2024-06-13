GO := go

.PHONY: clean

all: dapp api

dapp: cmd/rollup/dapp.go rollups/helpers.go rollups/model.go
	$(GO) mod tidy
	$(GO) build -o dapp ./cmd/rollup

api: cmd/api/main.go
	$(GO) mod tidy
	$(GO) build -o api ./cmd/api

clean:
	@rm -rf dapp api


# GO := go
#
# .PHONY: clean
#
# dapp: cmd/rollup/dapp.go rollups/helpers.go rollups/model.go
# 	$(GO) mod tidy
# 	$(GO) build -o dapp ./cmd/rollup
#
# clean:
# 	@rm -rf dapp
