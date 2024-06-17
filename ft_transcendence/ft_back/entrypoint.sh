#!/bin/sh

while ! nc -z db 5432; do
    sleep 0.1
done

python3 manage.py makemigrations ft_user
python3 manage.py migrate ft_user
python3 manage.py makemigrations chatting
python3 manage.py migrate chatting
python3 manage.py makemigrations tournament
python3 manage.py migrate tournament
echo "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.create_superuser('$DB_USER', '', '$DB_PASS')" | python manage.py shell

python3 manage.py migrate

exec "$@"