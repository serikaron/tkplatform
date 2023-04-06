package ginx

import "github.com/gin-gonic/gin"

// @Description: ResponseWriter扩展gin.ResponseWriter,用于获取返回数据,保存至Data
type ResponseWriter struct {
	gin.ResponseWriter
	Data []byte
	size int
}

func NewResponseWriter(writer gin.ResponseWriter) *ResponseWriter {
	return &ResponseWriter{ResponseWriter: writer}
}

func (w *ResponseWriter) Write(data []byte) (n int, err error) {
	w.Data = data // 将数据保存与Data中
	w.WriteHeaderNow()
	n, err = w.ResponseWriter.Write(data)
	w.size += n
	return
}
