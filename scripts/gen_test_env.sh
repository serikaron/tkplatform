cat << EOF > .env
COMPOSE_PROJECT_NAME=tk
REGISTRY=car.daoyi365.com:5000/
HOST_NAME=http://localhost:9000

MONGO_USER_HOST=user_db
MONGO_USER_DB=tkuser
MONGO_USER_USER=tkuser
MONGO_USER_PASS=tkuser

MONGO_SYSTEM_HOST=system_db
MONGO_SYSTEM_DB=tksystem
MONGO_SYSTEM_USER=tksystem
MONGO_SYSTEM_PASS=tksystem

MONGO_SITE_HOST=site_db
MONGO_SITE_DB=tksite
MONGO_SITE_USER=tksite
MONGO_SITE_PASS=tksite

MONGO_LEDGER_HOST=ledger_db
MONGO_LEDGER_DB=tkledger
MONGO_LEDGER_USER=tkledger
MONGO_LEDGER_PASS=tkledger

MONGO_PAYMENT_HOST=payment_db
MONGO_PAYMENT_DB=tkpayment
MONGO_PAYMENT_USER=tkpayment
MONGO_PAYMENT_PASS=tkpayment

MONGO_ADMIN_HOST=admin_db
MONGO_ADMIN_DB=tkadmin
MONGO_ADMIN_USER=tkadmin
MONGO_ADMIN_PASS=tkadmin

SECRET_KEY=123456

SMSBAO_USER=111
SMSBAO_KEY=222

MOCK_PAY=1
EOF

cat .env

cat << EOF > go-config.json
{
  "production_env": "test",
  "web_root": "../",
  "bind_port": 9010,
  "bind_addr": "http://localhost:9010",
  "storage_root": "../file/",
  "storage_tmp": "../tmp/",
  "db_name": "mongo",
  "db_source": "localhost:27017",
  "logger_level": 0,
  "mongo_user_source": "user_db:27017",
  "mongo_user": "tkuser",
  "mongo_user_password": "tkuser",
  "mongo_payment_source": "payment_db:27017",
  "mongo_payment": "tkpayment",
  "mongo_payment_password": "tkpayment",
  "client_id": "tkplatform",
  "client_secret": "mkl23sml8sx9k02DxQkd5M32LkB6ux",
  "enable_orm_log": true,
  "enable_http_log": true
}
EOF

cat go-config.json
