apk update && apk upgrade && apk add --no-cache npm && apk add --no-cache openssl
npm install js-cookie

openssl req -newkey rsa:4096 -days 30 -nodes -x509 \
    -subj "/C=KR/ST=Seoul/L=Seoul/O=42Seoul/OU=${COALITIONS}/CN=${TEAM_NAME}.42.fr" \
    -keyout "/etc/ssl/${TEAM_NAME}.42.fr.key" \
    -out "/etc/ssl/${TEAM_NAME}.42.fr.crt" 2>/dev/null

nginx -g 'daemon off;'