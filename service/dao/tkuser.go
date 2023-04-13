package dao

import (
	"context"
	"encoding/json"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"log"
	"service/logger"
	"service/model"
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

// 数据结构体
type UserCheckRecord struct {
	UserId             string `bson:"userId"`
	CheckAccount       string `bson:"checkAccount"`
	CheckAccountResult string `bson:"checkAccountResult"`
	CreatedAt          int64  `bson:"createdAt"`
}

func AddUserCheckRecord(db *mongo.Database, userId, checkAccount, checkResultStr string) error {
	collection := db.Collection("userCheckRecord")
	deleteResult, err := collection.DeleteMany(context.Background(), bson.M{"userId": userId, "checkAccount": checkAccount})
	if err != nil {
		log.Fatal(err)
	}
	log.Println("删除数据成功:", deleteResult)

	objId, err := collection.InsertOne(context.TODO(), &UserCheckRecord{
		UserId:             userId,
		CheckAccount:       checkAccount,
		CheckAccountResult: checkResultStr,
		CreatedAt:          time.Now().Unix(),
	})
	if err != nil {
		logger.Error(err)
		return err
	}
	log.Println("录入数据成功，objId:", objId)
	return nil
}

func GetUser(db *mongo.Database, userId string) (*model.User, error) {
	collection := db.Collection("users")

	var user model.User
	id, _ := primitive.ObjectIDFromHex(userId)
	err := collection.FindOne(context.TODO(), bson.M{"_id": id}).Decode(&user)
	if err != nil {
		logger.Error(err)
		return nil, err
	}
	return &user, nil
}

// 过去一周
func GetUserCheckWangWeekRecords(db *mongo.Database, userId string) []*model.UserCheckRecordResp {
	collection := db.Collection("userCheckRecord")
	now := time.Now()
	lastWeek := now.AddDate(0, 0, -7)

	cur, err := collection.Find(context.Background(), bson.M{"userId": userId, "createdAt": bson.M{
		"$gt": lastWeek.Unix(),
		"$lt": now.Unix(),
	}})
	if err != nil {
		logger.Error(err)
		return nil
	}
	var all []*UserCheckRecord
	err = cur.All(context.Background(), &all)
	if err != nil {
		log.Fatal(err)
	}
	_ = cur.Close(context.Background())

	var list []*model.UserCheckRecordResp
	for _, one := range all {
		var checkResult model.CheckSumResp
		err = json.Unmarshal([]byte(one.CheckAccountResult), &checkResult)
		if err != nil {
			logger.Error(err)
			continue
		}
		list = append(list, &model.UserCheckRecordResp{
			UserId:             one.UserId,
			CheckAccount:       one.CheckAccount,
			CheckAccountResult: &checkResult,
			CreatedAt:          one.CreatedAt,
		})
	}
	return list
}

type UserCheckAccount struct {
	UserId       string `bson:"userId"`
	CheckAccount string `bson:"checkAccount"`
}

func GetUserCheckAccountList(db *mongo.Database, userId string) []string {
	collection := db.Collection("userCheckAccounts")

	cur, err := collection.Find(context.Background(), bson.M{"userId": userId})
	if err != nil {
		logger.Error(err)
		return nil
	}
	var all []*UserCheckAccount
	err = cur.All(context.Background(), &all)
	if err != nil {
		log.Fatal(err)
	}
	_ = cur.Close(context.Background())

	var list []string
	for _, one := range all {
		list = append(list, one.CheckAccount)
	}
	return list
}

func GetUserCheckAccountAdd(db *mongo.Database, userId, checkAccount string) error {
	collection := db.Collection("userCheckAccounts")

	objId, err := collection.InsertOne(context.TODO(), &UserCheckAccount{
		UserId:       userId,
		CheckAccount: checkAccount,
	})
	if err != nil {
		logger.Error(err)
		return err
	}
	log.Println("录入数据成功，objId:", objId)
	return nil
}

func GetUserCheckAccountDelete(db *mongo.Database, userId, checkAccount string) error {
	collection := db.Collection("userCheckAccounts")

	deleteResult, err := collection.DeleteOne(context.Background(), bson.M{"userId": userId, "checkAccount": checkAccount})
	if err != nil {
		log.Fatal(err)
	}
	log.Println("删除数据成功:", deleteResult)

	return nil
}
