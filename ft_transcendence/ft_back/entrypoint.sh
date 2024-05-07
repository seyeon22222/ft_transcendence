#!/bin/sh

while ! nc -z db 5432; do
    sleep 0.1
done

# openssl req -newkey rsa:4096 -days 30 -nodes -x509 \
#     -subj "/C=KR/ST=Seoul/L=Seoul/O=42Seoul/OU=${TEAM_NAME}/CN=${TEAM_NAME}.42.fr" \
#     -keyout "/etc/ssl/${TEAM_NAME}.42.fr.key" \
#     -out "/etc/ssl/${TEAM_NAME}.42.fr.crt" 2>/dev/null

python3 manage.py makemigrations ft_user
python3 manage.py migrate ft_user
python3 manage.py makemigrations chatting
python3 manage.py migrate chatting
echo "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.create_superuser('$DB_USER', '', '$DB_PASS')" | python manage.py shell

python3 manage.py migrate
python3 manage.py runserver 0.0.0.0:8000

exec "$@"
