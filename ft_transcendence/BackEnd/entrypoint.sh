#!/bin/sh

while ! nc -z db 5432; do
    sleep 0.1
done

python3 manage.py makemigrations User
python3 manage.py migrate User
python3 manage.py makemigrations chatting
python3 manage.py migrate chatting
python3 manage.py makemigrations tournament
python3 manage.py migrate tournament
python3 manage.py migrate

exec "$@"