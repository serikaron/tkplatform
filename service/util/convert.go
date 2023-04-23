package util

import (
	"regexp"
	"strconv"
	"strings"
	"time"
)

func Int64ConvertString(n int64) string {
	return strconv.FormatFloat(float64(n)/100, 'f', 2, 64)
}

func TrimHtml(src string) string {

	//将HTML标签全转换成小写

	re, _ := regexp.Compile("\\<[\\S\\s]+?\\>")

	src = re.ReplaceAllStringFunc(src, strings.ToLower)

	//去除STYLE

	re, _ = regexp.Compile("\\<style[\\S\\s]+?\\</style\\>")

	src = re.ReplaceAllString(src, "")

	//去除SCRIPT

	re, _ = regexp.Compile("\\<script[\\S\\s]+?\\</script\\>")

	src = re.ReplaceAllString(src, "")

	//去除所有尖括号内的HTML代码，并换成换行符

	re, _ = regexp.Compile("\\<[\\S\\s]+?\\>")

	src = re.ReplaceAllString(src, "\n")

	//去除连续的换行符

	re, _ = regexp.Compile("\\s{2,}")

	src = re.ReplaceAllString(src, "\n")

	src = strings.Replace(src, "&nbsp;", "", -1)
	src = strings.Replace(src, "\n", "", -1)
	src = strings.Replace(src, "实名认证：", "", -1)
	src = strings.Replace(src, "普通会员", "", -1)

	return strings.TrimSpace(src)

}

func YmdStringToTime(s string) time.Time {
	t, _ := time.ParseInLocation("2006-01-02", s, time.Local)
	return t
}
