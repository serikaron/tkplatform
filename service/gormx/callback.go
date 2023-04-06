package gormx

import "github.com/jinzhu/gorm"

// @Description: 当Gorm出现Update错误，例如Update全局数据时panic
// @Author: 张森
// @Date: 2018-03-27
func SetDirectPanicWhenErrBeforeUpdate(db *gorm.DB) {
	db.Callback().Update().After("gorm:before_update").Register("plugin:before_update_err_panic", func(scope *gorm.Scope) {
		if scope.HasError() {
			panic(scope.DB().Error.Error())
		}
	})
}
