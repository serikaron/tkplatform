package main

import (
	"flag"
	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
	"service/config"
	"service/controller"
	"service/logger"
	"service/middleware"
)

func main() {
	logger.SetLevel(logger.DEBUG)

	configPath := flag.String("conf", "config/config.json", "Config file path")
	flag.Parse()

	err := config.LoadConfig(*configPath)
	if err != nil {
		logger.Fatal("Config Failed!!!!", err)
		return
	}

	r := gin.New()

	gin.SetMode(gin.DebugMode)

	r.Use(gin.Logger())
	r.Use(gin.Recovery())

	apiV1 := r.Group("/v1")
	apiGroup := apiV1.Group("/api").Use(middleware.CorsAllowHandler)
	apiGroup.OPTIONS("/*f", middleware.CorsAllowHandler)

	//系统API
	apiGroup.Use(middleware.MongoDbPrepareHandler)
	{
		apiGroup.POST("/check", controller.CheckWangHandler)
	}

	r.Run(":" + config.GetBindPort())
}
