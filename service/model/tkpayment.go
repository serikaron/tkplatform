package model

// 数据结构体
type UserWallet struct {
	UserId      string `bson:"userId"`
	Cash        int64  `bson:"cash"`
	Rice        int64  `bson:"rice"`
	InvitePoint int64  `bson:"invitePoint"`
	Income      int64  `bson:"income"`
	Recharge    int64  `bson:"recharge"`
	Withdraw    int64  `bson:"withdraw"`
}

type Member struct {
	Title      string `bson:"title"`
	Price      int64  `bson:"price"`
	RemainDays int    `bson:"remainDays"`
	CreatedAt  int64  `bson:"createdAt"`
}

type Withdraw struct {
	Title     string `bson:"title"`
	Amount    int64  `bson:"amount"`
	Balance   int64  `bson:"balance"`
	CreatedAt int64  `bson:"createdAt"`
}

type DownLine struct {
	Title     string `bson:"title"`
	Amount    int64  `bson:"amount"`
	Balance   int64  `bson:"balance"`
	CreatedAt int64  `bson:"createdAt"`
}

type Activity struct {
	Title     string `bson:"title"`
	Amount    int64  `bson:"amount"`
	Balance   int64  `bson:"balance"`
	CreatedAt int64  `bson:"createdAt"`
}

type Rice struct {
	Title      string `bson:"title"`
	Price      int64  `bson:"price"`
	RemainDays int    `bson:"remainDays"`
	CreatedAt  int64  `bson:"createdAt"`
}

type UserWalletRecord struct {
	Id        string    `bson:"_id"`
	UserId    string    `bson:"userId"`
	Phone     string    `bson:"phone"`
	IdNo      string    `bson:"idNo"`
	Name      string    `bson:"name"`
	Type      int       `bson:"type"`
	Member    *Member   `bson:"member"`
	Withdraw  *Withdraw `bson:"withdraw"`
	DownLine  *DownLine `bson:"downLine"`
	Activity  *Activity `bson:"activity"`
	Rice      *Rice     `bson:"rice"`
	CreatedAt int64     `bson:"createdAt"`
}

const (
	UserWalletRecordTypeMember   = 1
	UserWalletRecordTypeWithdraw = 2
	UserWalletRecordTypeDownLine = 3
	UserWalletRecordTypeActivity = 4
	UserWalletRecordTypeRice     = 5
)

type UserWalletWithdrawRecord struct {
	Id        string `bson:"_id"`
	UserId    string `bson:"userId"`
	Phone     string `bson:"phone"`
	IdNo      string `bson:"idNo"`
	Name      string `bson:"name"`
	Comment   string `bson:"comment"`
	Amount    int64  `bson:"amount"`
	Fee       int64  `bson:"fee"`
	Status    bool   `bson:"status"`
	CreatedAt int64  `bson:"createdAt"`
}

type MemberItem struct {
	Id            string `bson:"_id"`
	Name          string `bson:"name"`
	Days          int64  `bson:"days"`
	Price         int64  `bson:"price"`
	OriginalPrice int64  `bson:"originalPrice"`
	Promotion     bool   `bson:"promotion"`
}

type RiceItem struct {
	Id            string `bson:"_id"`
	Name          string `bson:"name"`
	Rice          int64  `bson:"rice"`
	Price         int64  `bson:"price"`
	OriginalPrice int64  `bson:"originalPrice"`
	Promotion     bool   `bson:"promotion"`
}

type CommissionItem struct {
	Id             string `bson:"_id"`
	CommissionType int    `bson:"commissionType"`
	Level          int    `bson:"level"`
	PeopleNumber   int    `bson:"peopleNumber"`
	Rate           int    `bson:"rate"`
}

type WithdrawFeeSetting struct {
	Id      string `bson:"_id"`
	FeeType int    `bson:"feeType"` //1-每X元固定金额手续费，2-比例
	Amount  int64  `bson:"amount"`  //固定金额
	Fee     int64  `bson:"fee"`     //手续费
	Rate    int    `bson:"rate"`
}
