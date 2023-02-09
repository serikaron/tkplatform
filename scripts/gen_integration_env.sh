cat << EOF > tests/integration/.env
COMPOSE_PROJECT_NAME=tk
MONGO_USER_HOST=user_db
MONGO_USER_DB=tkuser
MONGO_USER_USER=tkuser
MONGO_USER_PASS=tkuser
SECRET_KEY=123456
EOF

cp tests/integration/.env .
