package dao

import (
	"context"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"log"
	"service/logger"
	"service/model"
)

func GetUserWallet(db *mongo.Database, userId string) *model.UserWallet {
	var wallet model.UserWallet
	collection := db.Collection("wallets")
	err := collection.FindOne(context.Background(), bson.M{"userId": userId}).Decode(&wallet)
	if err != nil {
		logger.Error(err)
		return nil
	}
	log.Println("collection.FindOne: ", wallet)
	return &wallet
}

func GetUserWalletRecords(db *mongo.Database, userId string, offset, limit int64, typ int) []*model.UserWalletRecord {
	collection := db.Collection("walletRecords")
	var findOptions options.FindOptions
	if limit > 0 {
		findOptions.SetLimit(limit)
		findOptions.SetSkip(offset)
	}
	var m bson.M
	if typ == 0 {
		m = bson.M{"userId": userId}
	} else if typ > 0 && typ <= 5 {
		m = bson.M{"userId": userId, "type": typ}
	}
	cur, err := collection.Find(context.Background(), m, &findOptions)
	if err != nil {
		logger.Error(err)
		return nil
	}
	var all []*model.UserWalletRecord
	err = cur.All(context.Background(), &all)
	if err != nil {
		log.Fatal(err)
	}
	_ = cur.Close(context.Background())

	for _, one := range all {
		log.Println("type:", one.Type, " - createdAt:", one.CreatedAt)
	}
	return all
}

func CountUserWalletRecords(db *mongo.Database, userId string, typ int) int64 {
	var m bson.M
	if typ == 0 {
		m = bson.M{"userId": userId}
	} else if typ > 0 && typ <= 5 {
		m = bson.M{"userId": userId, "type": typ}
	}
	collection := db.Collection("walletRecords")
	count, err := collection.CountDocuments(context.Background(), m)
	if err != nil {
		logger.Error(err)
		return 0
	}
	log.Println("userCheckRecord CountDocuments:", count)
	return count
}

func GetUserWalletWithdrawRecords(db *mongo.Database, userId string, offset, limit int64) []*model.UserWalletWithdrawRecord {
	collection := db.Collection("walletWithdrawRecords")
	var findOptions options.FindOptions
	if limit > 0 {
		findOptions.SetLimit(limit)
		findOptions.SetSkip(offset)
	}
	cur, err := collection.Find(context.Background(), bson.M{"userId": userId}, &findOptions)
	if err != nil {
		logger.Error(err)
		return nil
	}
	var all []*model.UserWalletWithdrawRecord
	err = cur.All(context.Background(), &all)
	if err != nil {
		log.Fatal(err)
	}
	_ = cur.Close(context.Background())

	for _, one := range all {
		log.Println("comment:", one.Comment, " - amount:", one.Amount)
	}
	return all
}

func CountUserWalletWithdrawRecords(db *mongo.Database, userId string) int64 {
	collection := db.Collection("walletWithdrawRecords")
	count, err := collection.CountDocuments(context.Background(), bson.M{"userId": userId})
	if err != nil {
		logger.Error(err)
		return 0
	}

	log.Println("userCheckRecord CountDocuments:", count)
	return count
}

func SumUserWalletWithdrawRecordsAmount(db *mongo.Database, userId string) int64 {
	collection := db.Collection("walletWithdrawRecords")
	cur, err := collection.Find(context.Background(), bson.M{"userId": userId})
	if err != nil {
		logger.Error(err)
		return 0
	}
	var all []*model.UserWalletWithdrawRecord
	err = cur.All(context.Background(), &all)
	if err != nil {
		log.Fatal(err)
	}
	_ = cur.Close(context.Background())

	sum := int64(0)
	for _, one := range all {
		sum += one.Amount
	}
	log.Println("walletWithdrawRecords sum:", sum)
	return sum
}

func GetMemberItems(db *mongo.Database) []*model.MemberItem {
	collection := db.Collection("memberItems")
	cur, err := collection.Find(context.Background(), bson.M{})
	if err != nil {
		logger.Error(err)
		return nil
	}
	var all []*model.MemberItem
	err = cur.All(context.Background(), &all)
	if err != nil {
		log.Fatal(err)
	}
	_ = cur.Close(context.Background())

	for _, one := range all {
		log.Println("name:", one.Name, " - days:", one.Days, " - price:", one.Price)
	}
	return all
}

func GetRiceItems(db *mongo.Database) []*model.RiceItem {
	collection := db.Collection("riceItems")
	cur, err := collection.Find(context.Background(), bson.M{})
	if err != nil {
		logger.Error(err)
		return nil
	}
	var all []*model.RiceItem
	err = cur.All(context.Background(), &all)
	if err != nil {
		log.Fatal(err)
	}
	_ = cur.Close(context.Background())

	for _, one := range all {
		log.Println("name:", one.Name, " - rice:", one.Rice, " - price:", one.Price)
	}
	return all
}
