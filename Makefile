DOCKER_COMPOSE_PATH = server
PORT = 5173

# Cores para estilização
COLOR_RESET = \033[0m
COLOR_YELLOW = \033[33m
COLOR_GREEN = \033[32m
COLOR_CYAN = \033[36m

run:
	@echo "$(COLOR_CYAN) Iniciando o servidor...\n"
	@cd $(DOCKER_COMPOSE_PATH) && docker compose up -d
	@printf "$(COLOR_YELLOW)\nAguardando os serviços...$(COLOR_RESET)\n"
	@sleep 15
	@$(MAKE) open

build:
	cd $(DOCKER_COMPOSE_PATH) && docker compose build

stop:
	cd $(DOCKER_COMPOSE_PATH) && docker compose stop

logs:
	cd $(DOCKER_COMPOSE_PATH) && docker compose logs

down:
	cd $(DOCKER_COMPOSE_PATH) && docker compose down

open:
	@if [ "$$(uname)" = "Linux" ]; then \
		xdg-open http://localhost:$(PORT); \
	elif [ "$$(uname)" = "Darwin" ]; then \
		open http://localhost:$(PORT); \
	elif [ "$$(uname)" = "MINGW64_NT-10.0" ]; then \
		start http://localhost:$(PORT); \
	else \
		echo "Unsupported OS"; \
	fi

