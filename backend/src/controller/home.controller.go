package controller

import (
	"github.com/gin-gonic/gin"
)

func Home(ctx *gin.Context) {
	ctx.JSON(200, map[string]any{
		"message": "Ok",
	})
	ctx.Abort()
}

func NotFound(ctx *gin.Context) {
	ctx.JSON(404, map[string]any{
		"err": "Not Found",
	})
	ctx.Abort()
}
