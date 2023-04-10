package dao

import (
	"context"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"log"
	"service/logger"
	"time"
)

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
