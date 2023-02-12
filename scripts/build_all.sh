docker compose -f docker-compose.yaml -f docker-compose.build.yaml build

docker buildx bake -f bake.hcl --load
