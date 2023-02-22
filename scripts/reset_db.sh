db_name=$1

if [ -z "$db_name" ]
then
  echo "usage reset_db.sh <db_name>"
  exit 1
fi

echo "reset $db_name"
docker compose stop $db_name || exit 1
rm -R mongo-data/$db_name || exit 1
docker compose up -d $db_name

