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
	Type      int       `bson:"type"`
	Member    *Member   `bson:"member"`
	Withdraw  *Withdraw `bson:"withdraw"`
	DownLine  *DownLine `bson:"downLine"`
	Activity  *Activity `bson:"activity"`
	Rice      *Rice     `bson:"rice"`
	CreatedAt int64     `bson:"createdAt"`
}

type UserWalletWithdrawRecord struct {
	Id        string `bson:"_id"`
	Comment   string `bson:"comment"`
	Amount    int64  `bson:"amount"`
	Fee       int64  `bson:"fee"`
	Status    bool   `bson:"status"`
	CreatedAt int64  `bson:"createdAt"`
}

type MemberItem struct {
	Id            string `bson:"_id"`
	Name          string `bson:"name"`
	Days          int    `bson:"days"`
	Price         int64  `bson:"price"`
	OriginalPrice int64  `bson:"originalPrice"`
	Promotion     bool   `bson:"promotion"`
}

type RiceItem struct {
	Id            string `bson:"_id"`
	Name          string `bson:"name"`
	Rice          int    `bson:"rice"`
	Price         int64  `bson:"price"`
	OriginalPrice int64  `bson:"originalPrice"`
	Promotion     bool   `bson:"promotion"`
}
