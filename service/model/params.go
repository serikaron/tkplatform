package model

type PurchaseRecords struct {
	StartDate string `json:"startDate"` //开始时间
	EndDate   string `json:"endDate"`   //结束时间
	Count     int    `json:"count"`     //确认购物数
}

type CheckSumResp struct {
	WangWangAccount string `json:"wangWangAccount"` //旺旺账号
	BuyerGoodNum    string `json:"buyerGoodNum"`    //买家信誉点
	Gender          string `json:"gender"`          //性别
	//Fox               string             `json:"fox"`               //狐狸
	//Fox               int                `json:"fox"`               //狐狸
	WwcreatedStr      string             `json:"wwcreatedStr"`      //注册时间
	WeekCount         int                `json:"weekCount"`         //本周被商家查询的次数
	CountBefore       int                `json:"countBefore"`       //上周被商家查询的次数
	Taoling           int                `json:"taoling"`           //淘龄 年为单位
	PurchaseRecords   []*PurchaseRecords `json:"purchaseRecords"`   //购买记录
	JiangNum          int                `json:"jiangNum"`          //降权数
	SentRate          string             `json:"sentRate"`          //发出的好评
	WeekCreditAverage float32            `json:"weekCreditAverage"` //买家总周平均
	ReceivedRate      string             `json:"receivedRate"`      //收到的好评
	YunBlack          int                `json:"yunBlack"`          //云黑单数量
	RenZheng          string             `json:"renZheng"`          //认证信息
	SellerTotalNum    string             `json:"sellerTotalNum"`    //商家信誉点
	BadTotal          string             `json:"badTotal"`          //中差评数
}

type MemberPo struct {
	Title      string `json:"title"`
	Price      int64  `json:"price"`
	RemainDays int    `json:"remainDays"`
	CreatedAt  int64  `json:"createdAt"`
}

type WithdrawPo struct {
	Title     string `json:"title"`
	Amount    int64  `json:"amount"`
	Balance   int64  `json:"balance"`
	CreatedAt int64  `json:"createdAt"`
}

type DownLinePo struct {
	Title     string `json:"title"`
	Amount    int64  `json:"amount"`
	Balance   int64  `json:"balance"`
	CreatedAt int64  `json:"createdAt"`
}

type ActivityPo struct {
	Title     string `json:"title"`
	Amount    int64  `json:"amount"`
	Balance   int64  `json:"balance"`
	CreatedAt int64  `json:"createdAt"`
}

type RicePo struct {
	Title      string `json:"title"`
	Price      int64  `json:"price"`
	RemainDays int    `json:"remainDays"`
	CreatedAt  int64  `json:"createdAt"`
}

type UserWalletRecordResp struct {
	Id        string      `json:"id"`
	UserId    string      `json:"userId"`
	Type      int         `json:"type"`
	Member    *MemberPo   `json:"member"`
	Withdraw  *WithdrawPo `json:"withdraw"`
	DownLine  *DownLinePo `json:"downLine"`
	Activity  *ActivityPo `json:"activity"`
	Rice      *RicePo     `json:"rice"`
	CreatedAt int64       `json:"createdAt"`
}

type UserWalletWithdrawRecordResp struct {
	Id        string `json:"id"`
	UserId    string `json:"userId"`
	Comment   string `json:"comment"`
	Amount    int64  `json:"amount"`
	Fee       int64  `json:"fee"`
	Status    bool   `json:"status"`
	CreatedAt int64  `json:"createdAt"`
}

type RiceItemResp struct {
	Id            string `json:"id"`
	Name          string `json:"name"`
	Rice          int64  `json:"rice"`
	Price         string `json:"price"`
	OriginalPrice string `json:"originalPrice"`
	Promotion     bool   `json:"promotion"`
}

type CommissionItemResp struct {
	Id             string  `json:"id"`
	CommissionType int     `json:"commissionType"`
	Level          int     `json:"level"`
	PeopleNumber   int     `json:"peopleNumber"`
	Rate           float32 `json:"rate"`
}

type MemberItemResp struct {
	Id            string `json:"id"`
	Name          string `json:"name"`
	Days          int64  `json:"days"`
	Price         string `json:"price"`
	OriginalPrice string `json:"originalPrice"`
	Promotion     bool   `json:"promotion"`
}

// 数据结构体
type UserCheckRecordResp struct {
	UserId             string        `json:"userId"`
	CheckAccount       string        `json:"checkAccount"`
	CheckAccountResult *CheckSumResp `json:"checkAccountResult"`
	CreatedAt          int64         `json:"createdAt"`
}
