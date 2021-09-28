SHELL:=/bin/bash   

up:
	@docker-compose --env-file .env.dev up --build --remove-orphans

down:
	@docker-compose down

clean:
	@docker volume prune
