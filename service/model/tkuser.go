package model

type UserMember struct {
	Expiration int64 `bson:"expiration"`
}

type User struct {
	Id           string      `bson:"_id"`
	Phone        string      `bson:"phone"`
	Level        int         `bson:"level"`
	Member       *UserMember `bson:"member"`
	RegisteredAt int64       `bson:"registeredAt"`
}
