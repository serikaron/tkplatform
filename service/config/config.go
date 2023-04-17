package config

import (
	"encoding/json"
	"io/ioutil"
	"os"
	"strconv"
)

type config struct {
	ProductionEnv        string `json:"production_env"`
	WebRoot              string `json:"web_root"`
	StorageRoot          string `json:"storage_root"`
	StorageTmp           string `json:"storage_tmp"`
	DBName               string `json:"db_name"`
	LoggerLevel          uint8  `json:"logger_level"`
	EnableOrmLog         bool   `json:"enable_orm_log"`
	EnableHttpLog        bool   `json:"enable_http_log"`
	BindPort             uint16 `json:"bind_port"`
	BindAddr             string `json:"bind_addr"`
	MongoUserSource      string `json:"mongo_user_source"`
	MongoUser            string `json:"mongo_user"`
	MongoUserPassword    string `json:"mongo_user_password"`
	MongoPaymentSource   string `json:"mongo_payment_source"`
	MongoPayment         string `json:"mongo_payment"`
	MongoPaymentPassword string `json:"mongo_payment_password"`
	ClientId             string `json:"client_id"`
	ClientSecret         string `json:"client_secret"`
}

var c config

func init() {
	c.ProductionEnv = "local"
	c.WebRoot = "../"
	c.StorageRoot = "../file/"
	c.StorageTmp = "../tmp/"
	c.DBName = "mysql"
	c.LoggerLevel = 0
	c.EnableOrmLog = true
	c.EnableHttpLog = true
	c.MongoUserSource = "mongodb://localhost:27017"
	c.MongoUser = "tkuser"
	c.MongoUserPassword = "tkuser"
	c.MongoPaymentSource = "mongodb://localhost:27017"
	c.MongoPayment = "tkpayment"
	c.MongoPaymentPassword = "tkpayment"
	c.BindPort = 9010
	c.BindAddr = "http://localhost:9010"
}

func LoadConfig(path string) error {
	if _, err := os.Stat(path); os.IsNotExist(err) {
		return nil
	}

	b, err := ioutil.ReadFile(path)
	if err != nil {
		return err
	}

	var ctmp config
	err = json.Unmarshal(b, &ctmp)
	if err != nil {
		return err
	}

	c = ctmp
	return nil
}

func ProductionEnv() string {
	return c.ProductionEnv
}

func GetWebRoot() string {
	return c.WebRoot
}

func GetStorageRoot() string {
	return c.StorageRoot
}

func GetStorageTmp() string {
	return c.StorageTmp
}

func GetDBName() string {
	return c.DBName
}

func GetLoggerLevel() uint8 {
	return c.LoggerLevel
}

func IsOrmLogEnabled() bool {
	return c.EnableOrmLog
}

func IsHttpLogEnabled() bool {
	return c.EnableHttpLog
}

func GetMongoUserSource() string {
	return c.MongoUserSource
}

func GetMongoUser() string {
	return c.MongoUser
}

func GetMongoUserPassword() string {
	return c.MongoUserPassword
}

func GetMongoPaymentSource() string {
	return c.MongoPaymentSource
}

func GetMongoPayment() string {
	return c.MongoPayment
}

func GetMongoPaymentPassword() string {
	return c.MongoPaymentPassword
}

func GetBindPort() string {
	return strconv.Itoa(int(c.BindPort))
}

func GetBindAddr() string {
	return c.BindAddr
}

func GetClientId() string {
	return c.ClientId
}

func GetClientSecret() string {
	return c.ClientSecret
}
