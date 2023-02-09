rm docker-compose.yaml
ln -s deploy.dockker-compose.yaml docker-compose.yaml
docker compose pull && docker compose stop && docker compose up