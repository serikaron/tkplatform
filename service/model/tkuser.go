package model

type UserMember struct {
	Expiration int64 `bson:"expiration"`
}

type Identification struct {
	IdNo string `bson:"idNo"`
	Name string `bson:"name"`
}

type User struct {
	Id             string          `bson:"_id"`
	Phone          string          `bson:"phone"`
	Level          int             `bson:"level"`
	Member         *UserMember     `bson:"member"`
	Identification *Identification `bson:"identification"`
	RegisteredAt   int64           `bson:"registeredAt"`
}
