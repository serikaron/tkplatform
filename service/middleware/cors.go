package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func CorsAllowHandler(c *gin.Context) {
	c.Writer.Header().Set("Access-Control-Allow-Private-Network", "true")
	c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, GET")
	c.Writer.Header().Set("Access-Control-Allow-Headers",
		"Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, Access-Control-Request-Private-Network, x-requested-with")
	if origin := c.Request.Header.Get("Origin"); origin != "" {
		c.Writer.Header().Set("Access-Control-Allow-Origin", origin)
	} else {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
	}
	if c.Request.Method == "OPTIONS" {
		c.Status(http.StatusOK)
	} else {
		c.Next()
	}
}