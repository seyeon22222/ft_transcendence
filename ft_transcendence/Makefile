DOCKER_COMPOSE = docker-compose --file ./docker-compose.yml

CYAN  := \033[1;36;40m
RESET := \033[0m
LOG   := printf "[$(CYAN)INFO$(RESET)] %s\n"

all:
	$(DOCKER_COMPOSE) up --build

clean:
	$(DOCKER_COMPOSE) down -v --rmi all --remove-orphans

fclean: clean
	@$(LOG) "fclean"
	@rm -rf data
	@rm -rf init_data
	@unzip init_data.zip
	@cp -r init_data data
	@rm -rf ./BackEnd/User/migrations/0001_initial.py
	@rm -rf ./BackEnd/chatting/migrations/0001_initial.py
	@rm -rf ./BackEnd/tournament/migrations/0001_initial.py
	@rm -rf ./BackEnd/profile_pictures
	@rm -rf __MACOSX
	docker system prune --volumes --all --force

re:
	make fclean
	make all

.PHONY: all up down clean fclean re
