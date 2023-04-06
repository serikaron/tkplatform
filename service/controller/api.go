package controller

import (
	"context"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"log"
	"net/http"
	"service/config"
	"service/constant"
	"service/logger"
	"service/third"
	"time"
)

const (
	ClientId     = "tkplatform"
	ClientSecret = "mkl23sml8sx9k02DxQkd5M32LkB6ux"
)

// @Route: [POST] /v1/api/check
// @Description: 查号接口
func CheckWangHandler(c *gin.Context) {
	type param struct {
		WangWangAccount string `json:"wang_wang_account" binding:"required"`
		UserId          string `json:"user_id"`
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

	userCount := CountUserCheckDaily(mongoDb, userId)
	if userCount >= 3 {
		constant.ErrMsg(c, constant.CheckAccountTooMuch)
		return
	}

	res, err := third.CheckWangWang(p.WangWangAccount)
	if err != nil {
		logger.Error(err)
		constant.ErrMsg(c, constant.StatusBadRequest, "验号接口调用失败"+err.Error())
		return
	}

	err = AddUserCheckRecord(mongoDb, userId, p.WangWangAccount)
	if err != nil {
		logger.Error(err)
		return
	}

	c.JSON(http.StatusOK, gin.H{"err_code": constant.Success, "data": res})
}

func CountUserCheckDaily(db *mongo.Database, userId string) int64 {
	now := time.Now()
	today := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, time.Local)
	tomorrow := time.Date(now.Year(), now.Month(), now.Day()+1, 0, 0, 0, 0, time.Local)
	collection := db.Collection("userCheckRecord")
	count, err := collection.CountDocuments(context.Background(), bson.M{"userId": userId, "createdAt": bson.M{
		"$gt": today.Unix(),
		"$lt": tomorrow.Unix(),
	}})
	if err != nil {
		logger.Error(err)
		return 0
	}
	log.Println("collection.CountDocuments:", count)
	return count
}

func AddUserCheckRecord(db *mongo.Database, userId, checkAccount string) error {
	// 数据结构体
	type UserCheckRecord struct {
		UserId       string `bson:"userId"`
		CheckAccount string `bson:"checkAccount"`
		CreatedAt    int64  `bson:"createdAt"`
	}

	collection := db.Collection("userCheckRecord")
	objId, err := collection.InsertOne(context.TODO(), &UserCheckRecord{
		UserId:       userId,
		CheckAccount: checkAccount,
		CreatedAt:    time.Now().Unix(),
	})
	if err != nil {
		logger.Error(err)
		return err
	}
	log.Println("录入数据成功，objId:", objId)
	return nil
}
