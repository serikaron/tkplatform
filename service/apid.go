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
		apiGroup.GET("/test", controller.TestHandler) //每天查号剩余次数

		apiGroup.GET("/check/daily/balance", controller.CheckDailyBalanceHandler)           //每天查号剩余次数
		apiGroup.POST("/check", controller.CheckWangHandler)                                //查号接口
		apiGroup.GET("/check/records/recently", controller.CheckWangRecordsRecentlyHandler) //最近查询账号以及最近最近查询结果

		apiGroup.GET("/user/check/account/list", controller.UserCheckAccountListHandler)      //批量查询账号列表
		apiGroup.POST("/user/check/account/add", controller.UserCheckAccountAddHandler)       //批量查询账号添加
		apiGroup.POST("/user/check/account/delete", controller.UserCheckAccountDeleteHandler) //批量查询账号删除

		apiGroup.GET("/user/wallet", controller.UserWalletHandler)                                 //用户钱包
		apiGroup.POST("/user/wallet/recharge", controller.UserWalletRechargeHandler)               //用户钱包充值
		apiGroup.GET("/user/wallet/overview", controller.UserWalletOverviewHandler)                //用户钱包资金总览
		apiGroup.GET("/user/wallet/records", controller.UserWalletRecordsHandler)                  //用户钱包资金明细
		apiGroup.GET("/user/wallet/withdraw/records", controller.UserWalletWithdrawRecordsHandler) //用户钱包提现管理

		apiGroup.GET("/store/member/items", controller.StoreMemberItemsHandler) //会员充值套餐
		apiGroup.GET("/store/rice/items", controller.StoreRiceItemsHandler)     //米粒购买套餐
	}

	r.Run(":" + config.GetBindPort())
}
