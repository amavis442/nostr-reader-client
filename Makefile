# ============================================================
# Makefile — nostr-reader-client (Svelte + Go)
# ============================================================

APP_NAME   := nostr-reader-client
CMD_PATH   := ./cmd/api
BIN_DIR    := bin
CLIENT_DIR := client

# Detect host OS voor default target
ifeq ($(OS),Windows_NT)
	HOST_OS   := windows
	HOST_ARCH := amd64
else
	UNAME_S   := $(shell uname -s)
	UNAME_M   := $(shell uname -m)

	ifeq ($(UNAME_S),Linux)
		HOST_OS := linux
	else ifeq ($(UNAME_S),Darwin)
		HOST_OS := darwin
	else
		HOST_OS := linux
	endif

	ifeq ($(UNAME_M),x86_64)
		HOST_ARCH := amd64
	else ifeq ($(UNAME_M),arm64)
		HOST_ARCH := arm64
	else ifeq ($(UNAME_M),aarch64)
		HOST_ARCH := arm64
	else
		HOST_ARCH := amd64
	endif
endif

# npm-commando: op Windows is npm een .cmd-wrapper. Die werkt ook onder de
# bash die make gebruikt, terwijl het kale 'npm' (Unix-shimscript) daar faalt.
ifeq ($(HOST_OS),windows)
	NPM := npm.cmd
else
	NPM := npm
endif

# Binaire namen
BIN_LINUX   := $(BIN_DIR)/$(APP_NAME)
BIN_WINDOWS := $(BIN_DIR)/$(APP_NAME).exe

# Go build flags
GO_FLAGS  := -trimpath
GO_LDFLAGS := -ldflags="-s -w"

# ============================================================
.PHONY: all build build-go build-go-linux build-go-windows \
        build-svelte dev clean fmt check help

# Default: bouw alles voor de huidige host
all: build

## build: Bouw Svelte én Go (voor host OS)
build: build-svelte build-go

## build-go: Compileer Go binary voor het huidige host OS
build-go:
	@mkdir -p $(BIN_DIR)
ifeq ($(HOST_OS),windows)
	@echo "[go] Bouwen voor windows/$(HOST_ARCH) → $(BIN_WINDOWS)"
	GOOS=windows GOARCH=$(HOST_ARCH) go build $(GO_FLAGS) $(GO_LDFLAGS) -o $(BIN_WINDOWS) $(CMD_PATH)
else
	@echo "[go] Bouwen voor $(HOST_OS)/$(HOST_ARCH) → $(BIN_LINUX)"
	GOOS=$(HOST_OS) GOARCH=$(HOST_ARCH) go build $(GO_FLAGS) $(GO_LDFLAGS) -o $(BIN_LINUX) $(CMD_PATH)
endif

## build-go-linux: Compileer Go binary voor Linux (amd64)
build-go-linux:
	@mkdir -p $(BIN_DIR)
	@echo "[go] Bouwen voor linux/amd64 → $(BIN_LINUX)"
	GOOS=linux GOARCH=amd64 go build $(GO_FLAGS) $(GO_LDFLAGS) -o $(BIN_LINUX) $(CMD_PATH)

## build-go-windows: Compileer Go binary voor Windows (amd64)
build-go-windows:
	@mkdir -p $(BIN_DIR)
	@echo "[go] Bouwen voor windows/amd64 → $(BIN_WINDOWS)"
	GOOS=windows GOARCH=amd64 go build $(GO_FLAGS) $(GO_LDFLAGS) -o $(BIN_WINDOWS) $(CMD_PATH)

## build-go-all: Compileer Go binary voor zowel Linux als Windows
build-go-all: build-go-linux build-go-windows

## build-svelte: Bouw de SvelteKit client (static) naar ./public
build-svelte:
	@echo "[svelte] Bouwen (vite build → ./public)..."
	cd $(CLIENT_DIR) && $(NPM) run build

## dev: Start Svelte dev-server én Go in watch-mode naast elkaar
dev:
	@echo "[dev] Svelte dev-server + Go air/run starten..."
	@if command -v air > /dev/null 2>&1; then \
		air -c .air.toml & (cd $(CLIENT_DIR) && $(NPM) run dev); \
	else \
		go run $(CMD_PATH)/main.go & (cd $(CLIENT_DIR) && $(NPM) run dev); \
	fi

## fmt: Formateer Go broncode
fmt:
	@echo "[fmt] gofmt..."
	gofmt -w .

## check: Svelte-check + Go vet
check:
	@echo "[check] svelte-check..."
	cd $(CLIENT_DIR) && $(NPM) run check
	@echo "[check] go vet..."
	go vet ./...

## clean: Verwijder build-artefacten
clean:
	@echo "[clean] bin/, public/ en client build-output verwijderen..."
	rm -rf $(BIN_DIR)
	rm -rf public
	rm -rf $(CLIENT_DIR)/build $(CLIENT_DIR)/.svelte-kit

## help: Toon beschikbare targets
help:
	@echo ""
	@echo "Gebruik: make [target]"
	@echo ""
	@grep -E '^## ' $(MAKEFILE_LIST) | sed 's/## /  /'
	@echo ""