// 可以通过gorm的Scopes函数将有些通用代码封装成函数
package gormx

import (
	"time"

	"github.com/jinzhu/gorm"
)

// @Description: 限制时间查询范围
// @Author: 张森
// @Date: 2018-03-27
func TimeScope(query string, date int64) func(db *gorm.DB) *gorm.DB {
	dateUnix := time.Unix(date, 0)
	return func(db *gorm.DB) *gorm.DB {
		return db.Where(query, dateUnix.Local().Format("2006-01-02 15:04:05"))
	}
}

// @Description: 此函数用于SQL金额计算时加锁，例如 money = money + 100
// @Author: 张森
// @Date: 2018-03-27
func LockedAdd(field string, amount int64) func(db *gorm.DB) *gorm.DB {
	return func(db *gorm.DB) *gorm.DB {
		return db.Update(field, gorm.Expr(field+"+?", amount))
	}
}

func AddInvoice(amount int64) func(db *gorm.DB) *gorm.DB {
	return func(db *gorm.DB) *gorm.DB {
		return db.Update("invoice", gorm.Expr("invoice+?", amount))
	}
}

func AddReceipt(amount int64) func(db *gorm.DB) *gorm.DB {
	return func(db *gorm.DB) *gorm.DB {
		return db.Update("receipt", gorm.Expr("receipt+?", amount))
	}
}
