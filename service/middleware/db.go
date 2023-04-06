package middleware

import (
	"bytes"
	"context"
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	"io/ioutil"
	"net/http"
	"service/config"
	"service/constant"
	"service/ginx"
	"service/gormx"
	"service/logger"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

var db *gorm.DB

func DbPrepareHandler(c *gin.Context) {
	if db == nil {
		var err error
		db, err = gorm.Open(config.GetDBName(), config.GetDBSource())
		if err != nil {
			logger.Error("Unable to connect to db ", err)
			c.AbortWithStatus(http.StatusInternalServerError)
			return
		}
		if config.IsOrmLogEnabled() {
			db.LogMode(true)
		} else {
			db.LogMode(false)
		}
		db.BlockGlobalUpdate(true)
		if !config.IsProductionEnv() {
			gormx.SetDirectPanicWhenErrBeforeUpdate(db)
		}
	}
	c.Set(constant.ContextDb, db)

	//初始化redis
	//if redis, ok := c.Get(constant.ContextRedis); !ok {
	//	logger.Info("初始化redis1")
	//	redis = store.NewRedisStore("tcp", config.GetRedisAddr(), config.GetRedisPassword(), 5*time.Minute)
	//	c.Set(constant.ContextRedis, redis)
	//}

	bodyBytes, _ := ioutil.ReadAll(c.Request.Body) //body内容读取两次的方法：先把body内容取出来，然后再给body赋值
	c.Request.Body.Close()                         //  must close
	c.Request.Body = ioutil.NopCloser(bytes.NewBuffer(bodyBytes))
	logger.Debug("参数内容:", string(bodyBytes))

	newWriter := ginx.NewResponseWriter(c.Writer)
	c.Writer = newWriter
	c.Next()
}

var mongoDb *mongo.Client

// pool连接池模式
func MongoDbPrepareHandler(c *gin.Context) {
	if mongoDb == nil {
		uri := ""
		logger.Debug("config.GetMongoUser():", config.GetMongoUser())
		if config.GetMongoUser() == "" {
			uri = `mongodb://localhost:27017`
		} else {
			//uri := "mongodb://tkuser:tkuser@10.168.4.61:27017"
			uri = "mongodb://" + config.GetMongoUser() + ":" + config.GetMongoPassword() + "@" + config.GetDBSource()
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
		mongoDb = client
	}
	c.Set(constant.ContextMongoDb, mongoDb)
	c.Next()

	// 返回 client
	//return client.Database(name), nil
}
