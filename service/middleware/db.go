package middleware

import (
	"context"
	"github.com/gin-gonic/gin"
	"service/config"
	"service/constant"
	"service/logger"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

var mongoUserDb, mongoPaymentDb *mongo.Client

// pool连接池模式
func MongoDbPrepareHandler(c *gin.Context) {
	logger.Debug("config.ProductionEnv():", config.ProductionEnv())
	if mongoUserDb == nil {
		uri := ""
		if config.ProductionEnv() == "local" {
			uri = `mongodb://localhost:27017`
		} else {
			uri = "mongodb://" + config.GetMongoUser() + ":" + config.GetMongoUserPassword() + "@" + config.GetMongoUserSource()
		}
		logger.Debug("uri:", uri)

		timeout := time.Duration(10) // 链接超时时间
		// 设置连接超时时间
		ctx, cancel := context.WithTimeout(context.Background(), timeout)
		defer cancel()
		// 通过传进来的uri连接相关的配置
		o := options.Client().ApplyURI(uri)
		// 发起链接
		client, err := mongo.Connect(ctx, o)
		if err != nil {
			logger.Error(err)
			return
		}
		// 判断服务是不是可用
		if err = client.Ping(context.Background(), readpref.Primary()); err != nil {
			logger.Error(err)
			return
		}
		mongoUserDb = client
	}
	if mongoPaymentDb == nil {
		uri := ""
		if config.ProductionEnv() == "local" {
			uri = `mongodb://localhost:27017`
		} else {
			uri = "mongodb://" + config.GetMongoPayment() + ":" + config.GetMongoPaymentPassword() + "@" + config.GetMongoPaymentSource()
		}
		logger.Debug("uri:", uri)

		timeout := time.Duration(10) // 链接超时时间
		// 设置连接超时时间
		ctx, cancel := context.WithTimeout(context.Background(), timeout)
		defer cancel()
		// 通过传进来的uri连接相关的配置
		o := options.Client().ApplyURI(uri)
		// 发起链接
		client, err := mongo.Connect(ctx, o)
		if err != nil {
			logger.Error(err)
			return
		}
		// 判断服务是不是可用
		if err = client.Ping(context.Background(), readpref.Primary()); err != nil {
			logger.Error(err)
			return
		}
		mongoPaymentDb = client
	}

	c.Set(constant.ContextMongoUserDb, mongoUserDb)
	c.Set(constant.ContextMongoPaymentDb, mongoPaymentDb)
	c.Next()
}
