package ginx

import (
	"errors"
	"reflect"
	"unsafe"

	"github.com/gin-gonic/gin"
)

var ErrGetEngineFailure = errors.New("获取 *gin.Engine 失败")

// @Description: 通过反射获取gin.Context的私有成员engine
func GetEngine(c *gin.Context) (*gin.Engine, error) {
	v := reflect.ValueOf(c).Elem()
	v.FieldByName("engine")
	for i := 0; i < v.NumField(); i++ {
		val := v.Field(i)
		if val.Type().String() == "*gin.Engine" {
			e := val.Elem()
			if e.IsValid() == false {
				return nil, ErrGetEngineFailure
			}
			engine := (*gin.Engine)(unsafe.Pointer(e.UnsafeAddr()))
			return engine, nil
		}
	}
	return nil, ErrGetEngineFailure
}
