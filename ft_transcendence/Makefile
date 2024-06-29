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
	@sudo rm -rf data
	@cp -r init_data data
	@rm -rf ./ft_back/ft_user/migrations/0001_initial.py
	@rm -rf ./ft_back/chatting/migrations/0001_initial.py
	@rm -rf ./ft_back/tournament/migrations/0001_initial.py
	@rm -rf ./ft_back/profile_pictures
	docker system prune --volumes --all --force

re:
	make fclean
	make all

.PHONY: all up down clean fclean re
