prepare:
	sudo apt update
	sudo apt install ansible

env:
	ansible-playbook -vv -i ansible/development ansible/development.yml --limit=local  --become


compose-build:
	docker-compose build web

compose-create-db:
	docker-compose run web mix ecto.create

compose-migrate-db:
	docker-compose run web mix ecto.migrate

compose:
	docker-compose up

compose-test:
	docker-compose run web make test

compile:
	mix compile

install:
	mix deps.get

lint:
	mix credo

test:
	mix test

.PHONY: test
