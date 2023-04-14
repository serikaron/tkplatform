package controller

import (
	"encoding/json"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"
	"net/http"
	"service/config"
	"service/constant"
	"service/dao"
	"service/logger"
	"service/model"
	"service/third"
	"service/util"
	"time"
)

const (
	ClientId     = "tkplatform"
	ClientSecret = "mkl23sml8sx9k02DxQkd5M32LkB6ux"
)

// @Route: [POST] /v1/api/check/daily/balance
// @Description: 每天查号剩余次数
func CheckDailyBalanceHandler(c *gin.Context) {
	if config.GetClientId() != ClientId || config.GetClientSecret() != ClientSecret {
		constant.ErrMsg(c, constant.BadParameter, "client error")
		return
	}

	userId := c.Request.Header.Get("id")
	logger.Debug("userId:", userId)

	db := c.MustGet(constant.ContextMongoDb).(*mongo.Client)
	mongoDb := db.Database("tkuser")

	userCount := dao.CountUserCheckDaily(mongoDb, userId)

	balance := int64(0)
	if userCount >= 3 {
		balance = 0
	} else {
		balance = 3 - userCount
	}

	c.JSON(http.StatusOK, gin.H{
		"code": constant.Success,
		"msg":  "ok",
		"data": gin.H{
			"daily_times_balance": balance,
		},
	})
}

// @Route: [POST] /v1/api/check/records
// @Description: 最近查询账号以及最近最近查询结果
func CheckWangRecordsRecentlyHandler(c *gin.Context) {
	if config.GetClientId() != ClientId || config.GetClientSecret() != ClientSecret {
		constant.ErrMsg(c, constant.BadParameter, "client error")
		return
	}

	userId := c.Request.Header.Get("id")
	logger.Debug("userId:", userId)

	db := c.MustGet(constant.ContextMongoDb).(*mongo.Client)
	mongoDb := db.Database("tkuser")

	//过去一周的查号记录
	records := dao.GetUserCheckWangWeekRecords(mongoDb, userId)

	c.JSON(http.StatusOK, gin.H{
		"code": constant.Success,
		"msg":  "ok",
		"data": records,
	})
}

// @Route: [POST] /v1/api/user/check/account/list
// @Description: 批量查询账号列表
func UserCheckAccountListHandler(c *gin.Context) {
	if config.GetClientId() != ClientId || config.GetClientSecret() != ClientSecret {
		constant.ErrMsg(c, constant.BadParameter, "client error")
		return
	}

	userId := c.Request.Header.Get("id")
	logger.Debug("userId:", userId)

	db := c.MustGet(constant.ContextMongoDb).(*mongo.Client)
	mongoDb := db.Database("tkuser")

	records := dao.GetUserCheckAccountList(mongoDb, userId)

	c.JSON(http.StatusOK, gin.H{
		"code": constant.Success,
		"msg":  "ok",
		"data": records,
	})
}

// @Route: [POST] /v1/api/user/check/account/add
// @Description: 批量查询账号添加
func UserCheckAccountAddHandler(c *gin.Context) {
	type param struct {
		WangWangAccount string `json:"wang_wang_account" binding:"required"`
	}

	var p param
	var err error
	if err = c.BindJSON(&p); err != nil {
		logger.Info("Invalid request param ", err)
		return
	}
	logger.Debug("api param:", p)

	if config.GetClientId() != ClientId || config.GetClientSecret() != ClientSecret {
		constant.ErrMsg(c, constant.BadParameter, "client error")
		return
	}

	if p.WangWangAccount == "" {
		constant.ErrMsg(c, constant.BadParameter, "旺旺账号不能为空")
		return
	}

	userId := c.Request.Header.Get("id")
	logger.Debug("userId:", userId)

	db := c.MustGet(constant.ContextMongoDb).(*mongo.Client)
	mongoDb := db.Database("tkuser")

	err = dao.GetUserCheckAccountAdd(mongoDb, userId, p.WangWangAccount)
	if err != nil {
		logger.Error(err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"code": constant.Success,
		"msg":  "ok",
		"data": nil,
	})
}

// @Route: [POST] /v1/api/user/check/account/delete
// @Description: 批量查询账号删除
func UserCheckAccountDeleteHandler(c *gin.Context) {
	type param struct {
		WangWangAccount string `json:"wang_wang_account" binding:"required"`
	}

	var p param
	var err error
	if err = c.BindJSON(&p); err != nil {
		logger.Info("Invalid request param ", err)
		return
	}
	logger.Debug("api param:", p)

	if config.GetClientId() != ClientId || config.GetClientSecret() != ClientSecret {
		constant.ErrMsg(c, constant.BadParameter, "client error")
		return
	}

	if p.WangWangAccount == "" {
		constant.ErrMsg(c, constant.BadParameter, "旺旺账号不能为空")
		return
	}

	userId := c.Request.Header.Get("id")
	logger.Debug("userId:", userId)

	db := c.MustGet(constant.ContextMongoDb).(*mongo.Client)
	mongoDb := db.Database("tkuser")

	err = dao.GetUserCheckAccountDelete(mongoDb, userId, p.WangWangAccount)
	if err != nil {
		logger.Error(err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"code": constant.Success,
		"msg":  "ok",
		"data": nil,
	})
}

// @Route: [POST] /v1/api/check
// @Description: 查号接口
func CheckWangHandler(c *gin.Context) {
	type param struct {
		WangWangAccount []string `json:"wang_wang_account" binding:"required"`
	}

	var p param
	var err error
	if err = c.BindJSON(&p); err != nil {
		logger.Info("Invalid request param ", err)
		return
	}
	logger.Debug("api param:", p)

	if config.GetClientId() != ClientId || config.GetClientSecret() != ClientSecret {
		constant.ErrMsg(c, constant.BadParameter, "client error")
		return
	}

	if len(p.WangWangAccount) == 0 {
		constant.ErrMsg(c, constant.BadParameter, "旺旺账号不能为空")
		return
	}
	userId := c.Request.Header.Get("id")
	logger.Debug("userId:", userId)

	db := c.MustGet(constant.ContextMongoDb).(*mongo.Client)
	mongoDb := db.Database("tkuser")

	user, err := dao.GetUser(mongoDb, userId)
	if err != nil {
		constant.ErrMsg(c, constant.UserNotExist)
		return
	}

	now := time.Now().Unix()
	if user.Member.Expiration < now {
		constant.ErrMsg(c, constant.UserMemberExpired)
		return
	}

	if userId != "63f5e5cf1fc4c03affc93fa2" {
		userCount := dao.CountUserCheckDaily(mongoDb, userId)
		if userCount >= 3 {
			constant.ErrMsg(c, constant.CheckAccountTooMuch)
			return
		}
	}

	//var list []model.CheckSumResp

	list := make([]model.CheckSumResp, 0)

	for _, wangAccount := range p.WangWangAccount {
		item, errCheck := third.CheckWangWang(wangAccount)
		if errCheck != nil {
			logger.Error(errCheck)
			//constant.ErrMsg(c, constant.StatusBadRequest, "验号接口调用失败"+errCheck.Error())
			continue
		}

		item.WangWangAccount = wangAccount
		item.RenZheng = util.TrimHtml(item.RenZheng)

		itemJson, errJson := json.Marshal(item)
		if err != nil {
			logger.Error(errJson)
		}

		errCheck = dao.AddUserCheckRecord(mongoDb, userId, wangAccount, string(itemJson))
		if errCheck != nil {
			logger.Error(errCheck)
			return
		}
		list = append(list, *item)
	}

	c.JSON(http.StatusOK, gin.H{
		"code": constant.Success,
		"msg":  "ok",
		"data": list,
	})
}

// @Route: [POST] /v1/api/user/wallet
// @Description: 用户钱包
func UserWalletHandler(c *gin.Context) {
	if config.GetClientId() != ClientId || config.GetClientSecret() != ClientSecret {
		constant.ErrMsg(c, constant.BadParameter, "client error")
		return
	}

	userId := c.Request.Header.Get("id")
	logger.Debug("userId:", userId)

	db := c.MustGet(constant.ContextMongoDb).(*mongo.Client)
	mongoDb := db.Database("tkpayment")

	wallet := dao.GetUserWallet(mongoDb, userId)

	c.JSON(http.StatusOK, gin.H{
		"code": constant.Success,
		"msg":  "ok",
		"data": gin.H{
			"rice": wallet.Rice,
		},
	})
}

// @Route: [POST] /v1/api/user/wallet/recharge
// @Description: 用户钱包充值
func UserWalletRechargeHandler(c *gin.Context) {
	type param struct {
		RechargeType int    `json:"recharge_type" binding:"required"` //1-会员充值，2-米粒购买
		ProductId    string `json:"product_id" binding:"required"`    //充值产品id
	}

	var p param
	var err error
	if err = c.BindJSON(&p); err != nil {
		logger.Info("Invalid request param ", err)
		return
	}
	logger.Debug("api param:", p)

	if config.GetClientId() != ClientId || config.GetClientSecret() != ClientSecret {
		constant.ErrMsg(c, constant.BadParameter, "client error")
		return
	}

	if p.RechargeType == 0 {
		constant.ErrMsg(c, constant.BadParameter, "充值类型不能为空")
		return
	}

	userId := c.Request.Header.Get("id")
	logger.Debug("userId:", userId)

	db := c.MustGet(constant.ContextMongoDb).(*mongo.Client)
	mongoDb := db.Database("tkuser")

	user, err := dao.GetUser(mongoDb, userId)
	if err != nil {
		constant.ErrMsg(c, constant.UserNotExist)
		return
	}

	mongoDb = db.Database("tkpayment")
	switch p.RechargeType {
	case 1:
		items := dao.GetMemberItems(mongoDb)
		var priceMember *model.MemberItem
		for _, item := range items {
			if item.Id == p.ProductId {
				priceMember = item
			}
		}
		logger.Debug("充值会员item:", priceMember)
		mongoDb = db.Database("tkuser")
		expiration := user.Member.Expiration + (priceMember.Days * 24 * 3600)
		errRice := dao.UserMemberRecharge(mongoDb, userId, expiration)
		if errRice != nil {
			constant.ErrMsg(c, constant.RechargeFailed)
			return
		}
	case 2:
		items := dao.GetRiceItems(mongoDb)
		var priceRice *model.RiceItem
		for _, item := range items {
			if item.Id == p.ProductId {
				priceRice = item
			}
		}
		logger.Debug("充值米粒item:", priceRice)
		wallet := dao.GetUserWallet(mongoDb, userId)
		rice := wallet.Rice + priceRice.Rice
		errRice := dao.UserWalletRiceRecharge(mongoDb, userId, rice)
		if errRice != nil {
			constant.ErrMsg(c, constant.RechargeFailed)
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"code": constant.Success,
		"msg":  "ok",
		"data": nil,
	})
}

// @Route: [POST] /v1/api/user/wallet/overview
// @Description: 用户钱包总览
func UserWalletOverviewHandler(c *gin.Context) {
	if config.GetClientId() != ClientId || config.GetClientSecret() != ClientSecret {
		constant.ErrMsg(c, constant.BadParameter, "client error")
		return
	}

	userId := c.Request.Header.Get("id")
	logger.Debug("userId:", userId)

	db := c.MustGet(constant.ContextMongoDb).(*mongo.Client)
	mongoDb := db.Database("tkpayment")

	wallet := dao.GetUserWallet(mongoDb, userId)

	c.JSON(http.StatusOK, gin.H{
		"code": constant.Success,
		"msg":  "ok",
		"data": gin.H{
			"income":   wallet.Income,
			"withdraw": wallet.Withdraw,
			"recharge": wallet.Recharge,
		},
	})
}

// @Route: [GET] /v1/api/user/wallet/records
// @Description: 用户钱包资金明细
func UserWalletRecordsHandler(c *gin.Context) {
	type param struct {
		Type   int   `form:"type"`
		Limit  int64 `form:"limit"`
		Offset int64 `form:"offset"`
	}

	var p param
	var err error
	if err = c.Bind(&p); err != nil {
		logger.Info("Invalid request param ", err)
		return
	}
	logger.Debug("api param:", p)

	if config.GetClientId() != ClientId || config.GetClientSecret() != ClientSecret {
		constant.ErrMsg(c, constant.BadParameter, "client error")
		return
	}

	userId := c.Request.Header.Get("id")
	logger.Debug("userId:", userId)

	db := c.MustGet(constant.ContextMongoDb).(*mongo.Client)
	mongoDb := db.Database("tkpayment")

	records := dao.GetUserWalletRecords(mongoDb, userId, p.Offset, p.Limit, p.Type)

	total := dao.CountUserWalletRecords(mongoDb, userId, p.Type)

	var list []*model.UserWalletRecordResp
	for _, record := range records {
		list = append(list, &model.UserWalletRecordResp{
			Id:   record.Id,
			Type: record.Type,
			Member: &model.MemberPo{
				Title:      record.Member.Title,
				Price:      record.Member.Price,
				RemainDays: record.Member.RemainDays,
				CreatedAt:  record.Member.CreatedAt,
			},
			Withdraw: &model.WithdrawPo{
				Title:     record.Withdraw.Title,
				Amount:    record.Withdraw.Amount,
				Balance:   record.Withdraw.Balance,
				CreatedAt: record.Withdraw.CreatedAt,
			},
			DownLine: &model.DownLinePo{
				Title:     record.DownLine.Title,
				Amount:    record.DownLine.Amount,
				Balance:   record.DownLine.Balance,
				CreatedAt: record.DownLine.CreatedAt,
			},
			Activity: &model.ActivityPo{
				Title:     record.Activity.Title,
				Amount:    record.Activity.Amount,
				Balance:   record.Activity.Balance,
				CreatedAt: record.Activity.CreatedAt,
			},
			Rice: &model.RicePo{
				Title:      record.Member.Title,
				Price:      record.Member.Price,
				RemainDays: record.Member.RemainDays,
				CreatedAt:  record.Member.CreatedAt,
			},
			CreatedAt: record.CreatedAt,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"code": constant.Success,
		"msg":  "ok",
		"data": gin.H{
			"total": total,
			"items": list,
		},
	})
}

// @Route: [POST] /v1/api/user/wallet/withdraw/records
// @Description: 用户钱包提现管理
func UserWalletWithdrawRecordsHandler(c *gin.Context) {
	type param struct {
		Limit  int64 `form:"limit"`
		Offset int64 `form:"offset"`
	}

	var p param
	var err error
	if err = c.Bind(&p); err != nil {
		logger.Info("Invalid request param ", err)
		return
	}
	logger.Debug("api param:", p)
	if config.GetClientId() != ClientId || config.GetClientSecret() != ClientSecret {
		constant.ErrMsg(c, constant.BadParameter, "client error")
		return
	}

	userId := c.Request.Header.Get("id")
	logger.Debug("userId:", userId)

	db := c.MustGet(constant.ContextMongoDb).(*mongo.Client)
	mongoDb := db.Database("tkpayment")

	records := dao.GetUserWalletWithdrawRecords(mongoDb, userId, p.Offset, p.Limit)
	total := dao.CountUserWalletWithdrawRecords(mongoDb, userId)
	sumAmount := dao.SumUserWalletWithdrawRecordsAmount(mongoDb, userId)

	var list []*model.UserWalletWithdrawRecordResp
	for _, record := range records {
		list = append(list, &model.UserWalletWithdrawRecordResp{
			Id:        record.Id,
			Comment:   record.Comment,
			Amount:    record.Amount,
			Fee:       record.Fee,
			Status:    record.Status,
			CreatedAt: record.CreatedAt,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"code": constant.Success,
		"msg":  "ok",
		"data": gin.H{
			"total": gin.H{
				"count":  total,
				"amount": sumAmount,
			},
			"items": list,
		},
	})
}

// @Route: [POST] /v1/api/store/member/items
// @Description: 会员充值套餐
func StoreMemberItemsHandler(c *gin.Context) {
	if config.GetClientId() != ClientId || config.GetClientSecret() != ClientSecret {
		constant.ErrMsg(c, constant.BadParameter, "client error")
		return
	}

	userId := c.Request.Header.Get("id")
	logger.Debug("userId:", userId)

	db := c.MustGet(constant.ContextMongoDb).(*mongo.Client)
	mongoDb := db.Database("tkpayment")

	items := dao.GetMemberItems(mongoDb)

	var list []*model.MemberItemResp
	for _, item := range items {
		list = append(list, &model.MemberItemResp{
			Id:            item.Id,
			Name:          item.Name,
			Days:          item.Days,
			Price:         util.Int64ConvertString(item.Price),
			OriginalPrice: util.Int64ConvertString(item.OriginalPrice),
			Promotion:     item.Promotion,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"code": constant.Success,
		"msg":  "ok",
		"data": list,
	})
}

// @Route: [POST] /v1/api/store/rice/items
// @Description: 米粒购买套餐
func StoreRiceItemsHandler(c *gin.Context) {
	if config.GetClientId() != ClientId || config.GetClientSecret() != ClientSecret {
		constant.ErrMsg(c, constant.BadParameter, "client error")
		return
	}

	userId := c.Request.Header.Get("id")
	logger.Debug("userId:", userId)

	db := c.MustGet(constant.ContextMongoDb).(*mongo.Client)
	mongoDb := db.Database("tkpayment")

	items := dao.GetRiceItems(mongoDb)

	var list []*model.RiceItemResp
	for _, item := range items {
		list = append(list, &model.RiceItemResp{
			Id:            item.Id,
			Name:          item.Name,
			Rice:          item.Rice,
			Price:         util.Int64ConvertString(item.Price),
			OriginalPrice: util.Int64ConvertString(item.OriginalPrice),
			Promotion:     item.Promotion,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"code": constant.Success,
		"msg":  "ok",
		"data": list,
	})
}

func TestHandler(c *gin.Context) {
	list := []string{}
	c.JSON(http.StatusOK, gin.H{
		"code": constant.Success,
		"msg":  "ok",
		"data": list,
	})
}
