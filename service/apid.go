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
		apiGroup.POST("/check", controller.CheckWangHandler)                                       //查号接口
		apiGroup.GET("/user/wallet", controller.UserWalletHandler)                                 //用户钱包
		apiGroup.GET("/user/wallet/overview", controller.UserWalletOverviewHandler)                //用户钱包资金总览
		apiGroup.GET("/user/wallet/records", controller.UserWalletRecordsHandler)                  //用户钱包资金明细
		apiGroup.GET("/user/wallet/withdraw/records", controller.UserWalletWithdrawRecordsHandler) //用户钱包提现管理

		apiGroup.GET("/store/member/items", controller.StoreMemberItemsHandler) //会员充值套餐
		apiGroup.GET("/store/rice/items", controller.StoreRiceItemsHandler)     //米粒购买套餐
	}

	r.Run(":" + config.GetBindPort())
}
