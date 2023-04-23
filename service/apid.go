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

		apiGroup.POST("/user/level/setting", controller.UserLevelSettingHandler) //用户等级设置

		apiGroup.GET("/user/check/account/list", controller.UserCheckAccountListHandler)      //批量查询账号列表
		apiGroup.POST("/user/check/account/add", controller.UserCheckAccountAddHandler)       //批量查询账号添加
		apiGroup.POST("/user/check/account/delete", controller.UserCheckAccountDeleteHandler) //批量查询账号删除

		apiGroup.GET("/user/wallet", controller.UserWalletHandler)                                 //用户钱包
		apiGroup.POST("/user/wallet/recharge", controller.UserWalletRechargeHandler)               //用户钱包充值
		apiGroup.GET("/user/wallet/overview", controller.UserWalletOverviewHandler)                //用户钱包资金总览
		apiGroup.GET("/user/wallet/records", controller.UserWalletRecordsHandler)                  //用户钱包资金明细
		apiGroup.POST("/user/wallet/withdraw", controller.UserWalletWithdrawHandler)               //用户钱包提现
		apiGroup.POST("/user/wallet/withdraw/audit", controller.UserWalletWithdrawAuditHandler)    //用户钱包提现审核
		apiGroup.GET("/user/wallet/withdraw/records", controller.UserWalletWithdrawRecordsHandler) //用户钱包提现管理
		apiGroup.GET("/user/withdraw/records", controller.UserWithdrawRecordsHandler)              //用户钱包提现管理

		apiGroup.GET("/promotion/commission/list", controller.PromotionCommissionListHandler)      //推广比例列表
		apiGroup.POST("/promotion/commission/add", controller.PromotionCommissionAddHandler)       //推广比例添加
		apiGroup.POST("/promotion/commission/update", controller.PromotionCommissionUpdateHandler) //推广比例修改
		apiGroup.POST("/promotion/commission/delete", controller.PromotionCommissionDeleteHandler) //推广比例删除

		apiGroup.GET("/store/member/items", controller.StoreMemberItemsHandler)             //会员充值套餐
		apiGroup.POST("/store/member/item/add", controller.StoreMemberItemAddHandler)       //会员充值套餐添加
		apiGroup.POST("/store/member/item/update", controller.StoreMemberItemUpdateHandler) //会员充值套餐修改
		apiGroup.POST("/store/member/item/delete", controller.StoreMemberItemDeleteHandler) //会员充值套餐删除
		apiGroup.GET("/store/rice/items", controller.StoreRiceItemsHandler)                 //米粒购买套餐
		apiGroup.POST("/store/rice/item/add", controller.StoreRiceItemAddHandler)           //米粒套餐添加
		apiGroup.POST("/store/rice/item/update", controller.StoreRiceItemUpdateHandler)     //米粒套餐修改
		apiGroup.POST("/store/rice/item/delete", controller.StoreRiceItemDeleteHandler)     //米粒套餐删除
	}

	r.Run(":" + config.GetBindPort())
}
