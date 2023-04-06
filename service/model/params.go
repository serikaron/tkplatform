package model

type PurchaseRecords struct {
	StartDate string `json:"startDate"` //开始时间
	EndDate   string `json:"endDate"`   //结束时间
	Count     int    `json:"count"`     //确认购物数
}

type CheckSumResp struct {
	BuyerGoodNum      string             `json:"buyerGoodNum"`      //买家信誉点
	Gender            string             `json:"gender"`            //性别
	Fox               string             `json:"fox"`               //狐狸
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
