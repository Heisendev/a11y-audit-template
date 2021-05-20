#!make
NETWORKS="$(shell docker network ls)"
VOLUMES="$(shell docker volume ls)"
POSTGRES_DB="$(shell cat ./secrets/postgres_db)"
POSTGRES_USER="$(shell cat ./secrets/postgres_user)"
POSTGRES_PASSWORD="$(shell cat ./secrets/postgres_passwd)"
SUCCESS=[ done "\xE2\x9C\x94" ]

# default arguments
user ?= root
service ?= api

all: traefik-network postgres-network postgres-volume
	@echo [ starting client '&' traefik... ]
	docker-compose up --build traefik client api db pgadmin

traefik-network:
ifeq (,$(findstring traefik-public,$(NETWORKS)))
	@echo [ creating traefik network... ]
	docker network create traefik-public
	@echo $(SUCCESS)
endif

postgres-network:
ifeq (,$(findstring postgres-net,$(NETWORKS)))
	@echo [ creating postgres network... ]
	docker network create postgres-net
	@echo $(SUCCESS)
endif

postgres-volume:
ifeq (,$(findstring postgres-db,$(VOLUMES)))
	@echo [ creating postgres volume... ]
	docker volume create postgres-db
	@echo $(SUCCESS)
endif

api: traefik-network postgres-network postgres-volume
	@echo [ starting api... ]
	docker-compose up traefik api db pgadmin

down:
	@echo [ teardown all containers... ]
	docker-compose down
	@echo $(SUCCESS)

test-client:
	@echo [ running client tests... ]
	docker-compose run client npm test 

debug-db:
	@# advanced command line interface for postgres
	@# includes auto-completion and syntax highlighting. https://www.pgcli.com/
	@docker run -it --rm --net postgres-net dencold/pgcli postgresql://$(POSTGRES_USER):$(POSTGRES_PASSWORD)@db:5432/$(POSTGRES_DB)

debug-api:
	@echo [ debugging api... ]
	docker-compose up traefik debug-api db pgadmin

dump:
	@echo [ dumping postgres backup for $(POSTGRES_DB)... ]
	@docker exec -it db pg_dump --username $(POSTGRES_USER) $(POSTGRES_DB) > ./api/scripts/backup.sql
	@echo $(SUCCESS)

.PHONY: all
.PHONY: traefik-network
.PHONY: down
.PHONY: test-client
.PHONY: postgres-network
.PHONY: postgres-volume
.PHONY: api
.PHONY: debug-db
.PHONY: debug-api
.PHONY: dump
