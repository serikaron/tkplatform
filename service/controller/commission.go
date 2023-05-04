package controller

import (
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"net/http"
	"service/config"
	"service/constant"
	"service/dao"
	"service/logger"
	"service/model"
)

// @Route: [POST] /v1/api/promotion/commission/list
// @Description: 推广提成比例列表
func PromotionCommissionListHandler(c *gin.Context) {
	if config.GetClientId() != ClientId || config.GetClientSecret() != ClientSecret {
		constant.ErrMsg(c, constant.BadParameter, "client error")
		return
	}

	userId := c.Request.Header.Get("id")
	logger.Debug("userId:", userId)

	db := c.MustGet(constant.ContextMongoPaymentDb).(*mongo.Client)
	mongoDb := db.Database("tkpayment")

	items := dao.GetCommissionItems(mongoDb)

	var list []*model.CommissionItemResp
	for _, item := range items {
		list = append(list, &model.CommissionItemResp{
			Id:             item.Id,
			CommissionType: item.CommissionType,
			Level:          item.Level,
			PeopleNumber:   item.PeopleNumber,
			Rate:           item.Rate,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"code": constant.Success,
		"msg":  "ok",
		"data": list,
	})
}

// @Route: [POST] /v1/api/promotion/commission/add
// @Description: 推广提成比例添加
func PromotionCommissionAddHandler(c *gin.Context) {
	type param struct {
		CommissionType int `json:"commissionType"`
		Level          int `json:"level"`
		PeopleNumber   int `json:"peopleNumber"`
		Rate           int `json:"rate"`
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

	userId := c.Request.Header.Get("id")
	logger.Debug("userId:", userId)

	db := c.MustGet(constant.ContextMongoPaymentDb).(*mongo.Client)
	mongoDb := db.Database("tkpayment")

	err = dao.AddCommissionItems(mongoDb, model.CommissionItem{
		Id:             primitive.NewObjectID().Hex(),
		CommissionType: p.CommissionType,
		Level:          p.Level,
		PeopleNumber:   p.PeopleNumber,
		Rate:           p.Rate,
	})
	if err != nil {
		constant.ErrMsg(c, constant.OperateWrong)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"code": constant.Success,
		"msg":  "ok",
		"data": nil,
	})
}

// @Route: [POST] /v1/api/promotion/commission/update
// @Description: 推广提成比例修改
func PromotionCommissionUpdateHandler(c *gin.Context) {
	type param struct {
		Id             string `json:"id"`
		CommissionType int    `json:"commissionType"`
		Level          int    `json:"level"`
		PeopleNumber   int    `json:"peopleNumber"`
		Rate           int    `json:"rate"`
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

	userId := c.Request.Header.Get("id")
	logger.Debug("userId:", userId)

	db := c.MustGet(constant.ContextMongoPaymentDb).(*mongo.Client)
	mongoDb := db.Database("tkpayment")

	err = dao.UpdateCommissionItems(mongoDb, model.CommissionItem{
		Id:             p.Id,
		CommissionType: p.CommissionType,
		Level:          p.Level,
		PeopleNumber:   p.PeopleNumber,
		Rate:           p.Rate,
	})
	if err != nil {
		constant.ErrMsg(c, constant.OperateWrong)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"code": constant.Success,
		"msg":  "ok",
		"data": nil,
	})
}

// @Route: [POST] /v1/api/promotion/commission/delete
// @Description: 推广提成比例删除
func PromotionCommissionDeleteHandler(c *gin.Context) {
	type param struct {
		Id string `json:"id"`
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

	userId := c.Request.Header.Get("id")
	logger.Debug("userId:", userId)

	db := c.MustGet(constant.ContextMongoPaymentDb).(*mongo.Client)
	mongoDb := db.Database("tkpayment")

	err = dao.DeleteCommissionItems(mongoDb, p.Id)
	if err != nil {
		constant.ErrMsg(c, constant.OperateWrong)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"code": constant.Success,
		"msg":  "ok",
		"data": nil,
	})
}
