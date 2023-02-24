service_name=$1

if [ -z "$service_name" ]
then
  echo "usage restart_service.sh <service_name>"
  exit 1
fi

echo "reset $service_name"
docker compose stop $service_name && docker compose up $service_name