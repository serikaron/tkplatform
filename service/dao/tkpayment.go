package dao

import (
	"context"
	"errors"
	"fmt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"log"
	"service/logger"
	"service/model"
	"time"
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

func UserWalletRiceRecharge(db *mongo.Database, userId string, rice int64) error {
	collection := db.Collection("wallets")
	updateResult, err := collection.UpdateOne(context.Background(), bson.M{"userId": userId}, bson.D{{"$set", bson.D{{"rice", rice}}}})
	if err != nil {
		logger.Error(err)
		return nil
	}
	log.Println("collection.UpdateOne: ", updateResult)
	if updateResult.MatchedCount != 1 {
		return errors.New("更新失败")
	}
	return nil
}

func UserWalletCashWithdraw(db *mongo.Database, userId string, cash int64) error {
	collection := db.Collection("wallets")
	updateResult, err := collection.UpdateOne(context.Background(), bson.M{"userId": userId}, bson.D{{"$set", bson.D{{"cash", cash}}}})
	if err != nil {
		logger.Error(err)
		return nil
	}
	log.Println("collection.UpdateOne: ", updateResult)
	if updateResult.MatchedCount != 1 {
		return errors.New("更新失败")
	}
	return nil
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

func AddUserWalletRecord(db *mongo.Database, userId string, typ int, member *model.Member, withdraw *model.Withdraw, downLine *model.DownLine, activity *model.Activity, rice *model.Rice) error {
	type UserWalletRecordDb struct {
		Id        primitive.ObjectID `bson:"_id"`
		UserId    string             `bson:"userId"`
		Type      int                `bson:"type"`
		Member    *model.Member      `bson:"member"`
		Withdraw  *model.Withdraw    `bson:"withdraw"`
		DownLine  *model.DownLine    `bson:"downLine"`
		Activity  *model.Activity    `bson:"activity"`
		Rice      *model.Rice        `bson:"rice"`
		CreatedAt int64              `bson:"createdAt"`
	}

	var newItem UserWalletRecordDb

	newItem.Id = primitive.NewObjectID()
	newItem.UserId = userId
	newItem.Type = typ
	newItem.CreatedAt = time.Now().Unix()

	switch typ { //1-购买，2-提现，3-下级抽成，4-活动奖励，5-米粒消耗
	case 1:
		newItem.Member = member
	case 2:
		newItem.Withdraw = withdraw
	case 3:
		newItem.DownLine = downLine
	case 4:
		newItem.Activity = activity
	case 5:
		newItem.Rice = rice
	}

	collection := db.Collection("walletRecords")
	objId, err := collection.InsertOne(context.TODO(), newItem)
	if err != nil {
		logger.Error(err)
		return err
	}
	fmt.Println("_id:", objId.InsertedID)
	return nil
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

func GetUserWalletWithdrawRecord(db *mongo.Database, recordId string) (*model.UserWalletWithdrawRecord, error) {
	collection := db.Collection("walletWithdrawRecords")

	var record model.UserWalletWithdrawRecord
	id, _ := primitive.ObjectIDFromHex(recordId)
	err := collection.FindOne(context.TODO(), bson.M{"_id": id}).Decode(&record)
	if err != nil {
		logger.Error(err)
		return nil, err
	}
	return &record, nil
}

func AddUserWalletWithdrawRecord(db *mongo.Database, m model.UserWalletWithdrawRecord) error {
	collection := db.Collection("walletWithdrawRecords")
	type UserWalletWithdrawRecordDb struct {
		Id        primitive.ObjectID `bson:"_id"`
		UserId    string             `bson:"userId"`
		Comment   string             `bson:"comment"`
		Amount    int64              `bson:"amount"`
		Fee       int64              `bson:"fee"`
		Status    bool               `bson:"status"`
		CreatedAt int64              `bson:"createdAt"`
	}

	newItem := UserWalletWithdrawRecordDb{
		Id:        primitive.NewObjectID(),
		UserId:    m.UserId,
		Comment:   m.Comment,
		Amount:    m.Amount,
		Fee:       m.Fee,
		Status:    m.Status,
		CreatedAt: m.CreatedAt,
	}

	objId, err := collection.InsertOne(context.TODO(), newItem)
	if err != nil {
		logger.Error(err)
		return err
	}
	fmt.Println("_id:", objId.InsertedID)
	return nil
}

func AuditUserWalletWithdrawRecord(db *mongo.Database, recordId string) error {
	collection := db.Collection("walletWithdrawRecords")
	logger.Debug("recordId:", recordId)
	id, _ := primitive.ObjectIDFromHex(recordId)
	updateResult, err := collection.UpdateOne(context.Background(), bson.M{"_id": id}, bson.D{{"$set", bson.D{
		{"status", true},
		{"comment", "提现成功"},
	}}})
	if err != nil {
		logger.Error(err)
		return err
	}
	log.Println("collection.UpdateOne: ", updateResult.MatchedCount)

	if updateResult.MatchedCount != 1 {
		return errors.New("更新失败")
	}
	return nil
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

func AddMemberItems(db *mongo.Database, m model.MemberItem) error {
	collection := db.Collection("memberItems")
	type MemberItemDb struct {
		Id            primitive.ObjectID `bson:"_id"`
		Name          string             `bson:"name"`
		Days          int64              `bson:"days"`
		Price         int64              `bson:"price"`
		OriginalPrice int64              `bson:"originalPrice"`
		Promotion     bool               `bson:"promotion"`
	}

	newItem := MemberItemDb{
		Id:            primitive.NewObjectID(),
		Name:          m.Name,
		Days:          m.Days,
		Price:         m.Price,
		OriginalPrice: m.OriginalPrice,
		Promotion:     m.Promotion,
	}

	objId, err := collection.InsertOne(context.TODO(), newItem)
	if err != nil {
		logger.Error(err)
		return err
	}
	fmt.Println("_id:", objId.InsertedID)
	return nil
}

func UpdateMemberItems(db *mongo.Database, m model.MemberItem) error {
	collection := db.Collection("memberItems")
	logger.Debug("m.Id:", m.Id)
	id, _ := primitive.ObjectIDFromHex(m.Id)
	updateResult, err := collection.UpdateOne(context.Background(), bson.M{"_id": id}, bson.D{{"$set", bson.D{
		{"name", m.Name},
		{"days", m.Days},
		{"price", m.Price},
		{"originalPrice", m.OriginalPrice},
		{"promotion", m.Promotion},
	}}})
	if err != nil {
		logger.Error(err)
		return err
	}
	log.Println("collection.UpdateOne: ", updateResult.MatchedCount)

	if updateResult.MatchedCount != 1 {
		return errors.New("更新失败")
	}
	return nil
}

func DeleteMemberItems(db *mongo.Database, id string) error {
	collection := db.Collection("memberItems")
	itemId, _ := primitive.ObjectIDFromHex(id)

	deleteResult, err := collection.DeleteOne(context.Background(), bson.M{"_id": itemId})
	if err != nil {
		logger.Error(err)
		return err
	}
	log.Println("删除数据成功:", deleteResult)

	return nil
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

func AddRiceItems(db *mongo.Database, m model.RiceItem) error {
	collection := db.Collection("riceItems")

	type RiceItemDb struct {
		Id            primitive.ObjectID `bson:"_id"`
		Name          string             `bson:"name"`
		Rice          int64              `bson:"rice"`
		Days          int64              `bson:"days"`
		Price         int64              `bson:"price"`
		OriginalPrice int64              `bson:"originalPrice"`
		Promotion     bool               `bson:"promotion"`
	}

	newItem := RiceItemDb{
		Id:            primitive.NewObjectID(),
		Name:          m.Name,
		Rice:          m.Rice,
		Price:         m.Price,
		OriginalPrice: m.OriginalPrice,
		Promotion:     m.Promotion,
	}
	objId, err := collection.InsertOne(context.TODO(), newItem)
	if err != nil {
		logger.Error(err)
		return err
	}
	fmt.Println("_id:", objId.InsertedID)
	return nil
}

func UpdateRiceItems(db *mongo.Database, m model.RiceItem) error {
	collection := db.Collection("riceItems")
	id, _ := primitive.ObjectIDFromHex(m.Id)
	updateResult, err := collection.UpdateOne(context.Background(), bson.M{"_id": id}, bson.D{{"$set", bson.D{
		{"name", m.Name},
		{"rice", m.Rice},
		{"price", m.Price},
		{"originalPrice", m.OriginalPrice},
		{"promotion", m.Promotion},
	}}})
	if err != nil {
		logger.Error(err)
		return err
	}
	log.Println("collection.UpdateOne: ", updateResult.MatchedCount)

	if updateResult.MatchedCount != 1 {
		return errors.New("更新失败")
	}
	return nil
}

func DeleteRiceItems(db *mongo.Database, id string) error {
	collection := db.Collection("riceItems")
	itemId, _ := primitive.ObjectIDFromHex(id)

	deleteResult, err := collection.DeleteOne(context.Background(), bson.M{"_id": itemId})
	if err != nil {
		logger.Error(err)
		return err
	}
	log.Println("删除数据成功:", deleteResult)

	return nil
}

func GetCommissionItems(db *mongo.Database) []*model.CommissionItem {
	collection := db.Collection("commissionSetting")
	cur, err := collection.Find(context.Background(), bson.M{})
	if err != nil {
		logger.Error(err)
		return nil
	}
	var all []*model.CommissionItem
	err = cur.All(context.Background(), &all)
	if err != nil {
		log.Fatal(err)
	}
	_ = cur.Close(context.Background())

	for _, one := range all {
		log.Println("CommissionType:", one.CommissionType, " - Rate:", one.Rate, " - level:", one.Level, " - PeopleNumber:", one.PeopleNumber)
	}
	return all
}

func AddCommissionItems(db *mongo.Database, m model.CommissionItem) error {
	collection := db.Collection("commissionSetting")

	type CommissionItemDb struct {
		Id             primitive.ObjectID `bson:"_id"`
		CommissionType int                `bson:"commissionType"`
		Level          int                `bson:"level"`
		PeopleNumber   int                `bson:"peopleNumber"`
		Rate           float32            `bson:"rate"`
	}

	newItem := CommissionItemDb{
		Id:             primitive.NewObjectID(),
		CommissionType: m.CommissionType,
		Level:          m.Level,
		PeopleNumber:   m.PeopleNumber,
		Rate:           m.Rate,
	}
	objId, err := collection.InsertOne(context.TODO(), newItem)
	if err != nil {
		logger.Error(err)
		return err
	}
	fmt.Println("_id:", objId.InsertedID)
	return nil
}

func UpdateCommissionItems(db *mongo.Database, m model.CommissionItem) error {
	collection := db.Collection("commissionSetting")
	id, _ := primitive.ObjectIDFromHex(m.Id)
	updateResult, err := collection.UpdateOne(context.Background(), bson.M{"_id": id}, bson.D{{"$set", bson.D{
		{"commissionType", m.CommissionType},
		{"level", m.Level},
		{"peopleNumber", m.PeopleNumber},
		{"rate", m.Rate},
	}}})
	if err != nil {
		logger.Error(err)
		return err
	}
	log.Println("collection.UpdateOne: ", updateResult.MatchedCount)

	if updateResult.MatchedCount != 1 {
		return errors.New("更新失败")
	}
	return nil
}

func DeleteCommissionItems(db *mongo.Database, id string) error {
	collection := db.Collection("commissionSetting")
	itemId, _ := primitive.ObjectIDFromHex(id)

	deleteResult, err := collection.DeleteOne(context.Background(), bson.M{"_id": itemId})
	if err != nil {
		logger.Error(err)
		return err
	}
	log.Println("删除数据成功:", deleteResult)

	return nil
}
