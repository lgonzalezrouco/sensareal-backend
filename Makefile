# Variables
DOCKER_COMPOSE = docker-compose
NODE = node
NPM = npm
DB_NAME = sensareal_db
DB_USER = sensareal_user
DB_PASSWORD = sensareal_password

# Colors for output
GREEN = \033[0;32m
RED = \033[0;31m
YELLOW = \033[1;33m
NC = \033[0m # No Color

# Initial setup targets
.PHONY: setup
setup: ## Initial setup of the project
	@echo "$(GREEN)Setting up the project...$(NC)"
	@$(NPM) install
	@$(DOCKER_COMPOSE) up -d
	@echo "$(YELLOW)Waiting for MySQL to be ready...$(NC)"
	@sleep 10
	@$(NPM) run migrate
	@$(NPM) run db:seed
	@echo "$(GREEN)Setup completed successfully!$(NC)"

.PHONY: setup-dev
setup-dev: ## Setup development environment
	@echo "$(GREEN)Setting up development environment...$(NC)"
	@$(NPM) install
	@$(DOCKER_COMPOSE) up -d
	@echo "$(YELLOW)Waiting for MySQL to be ready...$(NC)"
	@sleep 10
	@$(NPM) run migrate
	@$(NPM) run db:seed
	@echo "$(GREEN)Development environment ready!$(NC)"

# Development targets
.PHONY: dev
dev: ## Start development server
	@echo "$(GREEN)Starting database...$(NC)"
	@$(DOCKER_COMPOSE) up -d
	@echo "$(GREEN)Starting development server...$(NC)"
	@$(NPM) run dev

.PHONY: start
start: ## Start production server
	@echo "$(GREEN)Starting production server...$(NC)"
	@$(NPM) start

# Database targets
.PHONY: db-up
db-up: ## Start database container
	@echo "$(GREEN)Starting database...$(NC)"
	@$(DOCKER_COMPOSE) up -d

.PHONY: db-down
db-down: ## Stop database container
	@echo "$(YELLOW)Stopping database...$(NC)"
	@$(DOCKER_COMPOSE) down

.PHONY: db-reset
db-reset: ## Reset database (drop and recreate)
	@echo "$(RED)Resetting database...$(NC)"
	@$(DOCKER_COMPOSE) down -v
	@$(DOCKER_COMPOSE) up -d
	@echo "$(YELLOW)Waiting for MySQL to be ready...$(NC)"
	@sleep 10
	@$(NPM) run migrate
	@$(NPM) run db:seed
	@echo "$(GREEN)Database reset completed!$(NC)"

.PHONY: db-migrate
db-migrate: ## Run database migrations
	@echo "$(GREEN)Running migrations...$(NC)"
	@$(NPM) run migrate

.PHONY: db-seed
db-seed: ## Seed database
	@echo "$(GREEN)Seeding database...$(NC)"
	@$(NPM) run db:seed

# Maintenance targets
.PHONY: clean
clean: ## Clean up temporary files and dependencies
	@echo "$(YELLOW)Cleaning up...$(NC)"
	@rm -rf node_modules
	@rm -rf dist
	@rm -f .env.local
	@echo "$(GREEN)Cleanup completed!$(NC)"

.PHONY: install
install: ## Install dependencies
	@echo "$(GREEN)Installing dependencies...$(NC)"
	@$(NPM) install

# Special cases
.PHONY: backup
backup: ## Create database backup
	@echo "$(GREEN)Creating database backup...$(NC)"
	@mkdir -p backups
	@docker exec sensareal-mysql mysqldump -u$(DB_USER) -p$(DB_PASSWORD) $(DB_NAME) > backups/backup_$$(date +%Y%m%d_%H%M%S).sql
	@echo "$(GREEN)Backup completed!$(NC)"

.PHONY: restore
restore: ## Restore database from backup (usage: make restore BACKUP_FILE=backups/backup_20240330_123456.sql)
	@if [ -z "$(BACKUP_FILE)" ]; then \
		echo "$(RED)Error: BACKUP_FILE is required$(NC)"; \
		echo "Usage: make restore BACKUP_FILE=backups/backup_20240330_123456.sql"; \
		exit 1; \
	fi
	@echo "$(GREEN)Restoring database from $(BACKUP_FILE)...$(NC)"
	@docker exec -i sensareal-mysql mysql -u$(DB_USER) -p$(DB_PASSWORD) $(DB_NAME) < $(BACKUP_FILE)
	@echo "$(GREEN)Restore completed!$(NC)"

.PHONY: logs
logs: ## View application logs
	@echo "$(GREEN)Showing logs...$(NC)"
	@$(DOCKER_COMPOSE) logs -f

# Help target
.PHONY: help
help: ## Show this help message
	@echo "$(GREEN)Available targets:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "$(YELLOW)%-20s$(NC) %s\n", $$1, $$2}' 