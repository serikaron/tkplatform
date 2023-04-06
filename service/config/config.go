package config

import (
	"encoding/json"
	"io/ioutil"
	"os"
	"strconv"
)

type config struct {
	ProductionEnv bool   `json:"production_env"`
	WebRoot       string `json:"web_root"`
	StorageRoot   string `json:"storage_root"`
	StorageTmp    string `json:"storage_tmp"`
	DBName        string `json:"db_name"`
	DBSource      string `json:"db_source"`
	LoggerLevel   uint8  `json:"logger_level"`
	EnableOrmLog  bool   `json:"enable_orm_log"`
	EnableHttpLog bool   `json:"enable_http_log"`
	BindPort      uint16 `json:"bind_port"`
	BindAddr      string `json:"bind_addr"`
	MongoUser     string `json:"mongo_user"`
	MongoPassword string `json:"mongo_password"`
	ClientId      string `json:"client_id"`
	ClientSecret  string `json:"client_secret"`
}

var c config

func init() {
	c.ProductionEnv = false
	c.WebRoot = "../"
	c.StorageRoot = "../file/"
	c.StorageTmp = "../tmp/"
	c.DBName = "mysql"
	c.DBSource = "mongodb://localhost:27017"
	c.LoggerLevel = 0
	c.EnableOrmLog = true
	c.EnableHttpLog = true
	c.MongoUser = "127.0.0.1:6379"
	c.MongoPassword = ""
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

func IsProductionEnv() bool {
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

func GetDBSource() string {
	return c.DBSource
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

func GetMongoUser() string {
	return c.MongoUser
}

func GetMongoPassword() string {
	return c.MongoPassword
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
