package constant

import (
	"net/http"
	"strings"

	"fmt"
	"time"

	"runtime"

	"path/filepath"

	"io"

	"os"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
)

type ErrorType int

const (
	UnknownError    = ErrorType(-1)
	Success         = ErrorType(0)
	BadParameter    = ErrorType(2)
	OperateWrong    = ErrorType(3)
	OperateNotFound = ErrorType(4)

	StatusBadRequest    = ErrorType(400) //http.StatusBadRequest
	StatusForbidden     = ErrorType(403) //http.StatusForbidden
	InternalServerError = ErrorType(500)
	NotImplemented      = ErrorType(501)
	BadGateway          = ErrorType(502)
	ServiceUnavailable  = ErrorType(503)

	CheckAccountTooMuch = ErrorType(1000)
	UserMemberExpired   = ErrorType(1001)
	UserNotExist        = ErrorType(1002)
	RechargeFailed      = ErrorType(1003)
	BalanceNotEnough    = ErrorType(1004)
)

var ErrCodeTextMap = map[ErrorType]string{
	UnknownError:    "未知错误",
	Success:         "操作成功",
	BadParameter:    "您的参数有误",
	OperateWrong:    "操作失败",
	OperateNotFound: "操作记录未找到",

	StatusBadRequest:    "请求失败",
	StatusForbidden:     "无权限",
	InternalServerError: "内部服务器错误",
	NotImplemented:      "未实现",
	BadGateway:          "错误的网关",
	ServiceUnavailable:  "服务不可用",

	CheckAccountTooMuch: "查号次数过多",
	UserMemberExpired:   "会员已过期",
	UserNotExist:        "用户不存在",
	RechargeFailed:      "充值失败",
	BalanceNotEnough:    "余额不足",
}

func printError(w io.Writer, c *gin.Context, msg string) {
	// 查找调用此函数时同时打印调用处的文件名与行号
	_, file, line, _ := runtime.Caller(2)
	output := fmt.Sprintf("%s ErrMsg: %s:%d %s",
		time.Now().Format("2006-01-02 15:04:05.999"),
		filepath.Base(filepath.Dir(file))+"/"+filepath.Base(file),
		line,
		msg)
	url := "url:" + c.Request.URL.Path

	fmt.Fprintf(w, "%s (%s)\n", output, url)
}

// StatusText returns a text for error code. It returns the empty
// string if the code is unknown.
func ErrCodeText(code ErrorType) string {
	return ErrCodeTextMap[code]
}

func TranslateErrCode(code ErrorType, extra ...string) string {
	var msg string
	msg = ErrCodeText(code)

	if len(extra) > 0 {
		msg += ": "
		msg += strings.Join(extra, ",")
	}

	return msg
}

func ErrMsg(c *gin.Context, errCode ErrorType, extra ...string) {
	var errMsg = TranslateErrCode(errCode, extra...)

	printError(os.Stdout, c, errMsg)

	c.JSON(http.StatusOK, gin.H{"code": errCode, "msg": errMsg, "data": nil})
}

func ErrMsgRecordNotFound(err error, c *gin.Context, errCode ErrorType, extra ...string) {
	if err == gorm.ErrRecordNotFound {
		ErrMsg(c, errCode, extra...)
	} else {
		c.AbortWithStatus(http.StatusInternalServerError)
	}
}

func ErrMsgDuplicateEntry(err error, c *gin.Context, errCode ErrorType, extra ...string) {
	if strings.Contains(err.Error(), "Duplicate") == true {
		duplicateEntry := strings.Split(err.Error(), "'")
		extra = append([]string{duplicateEntry[1]}, extra...)
		ErrMsg(c, errCode, extra...)
	} else {
		c.AbortWithStatus(http.StatusInternalServerError)
	}
}

func IsErrScanNilValue(err error) bool {
	return strings.Contains(err.Error(), "converting driver.Value type <nil>")
}
