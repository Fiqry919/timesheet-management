package controller

import (
	"backend/src/database"
	"backend/src/model"

	"github.com/gin-gonic/gin"
)

func GetProject(ctx *gin.Context) {
	var project []model.Project
	err := database.Conn.Table("project").
		// Order("name ASC"). // enable if want use orderby name
		Find(&project).Error
	if err != nil {
		ctx.JSON(500, map[string]interface{}{"err": err.Error()})
		ctx.Abort()
		return
	}

	ctx.JSON(200, map[string]interface{}{"data": project})
	ctx.Abort()
}

func AddProject(ctx *gin.Context) {
	var request struct {
		Name string `json:"name" binding:"required"`
	}

	if err := ctx.ShouldBindJSON(&request); err != nil {
		ctx.JSON(400, map[string]interface{}{"err": "Bad request"})
		ctx.Abort()
		return
	}

	project := model.Project{Name: request.Name}
	if err := database.Conn.Create(&project).Error; err != nil {
		ctx.JSON(500, map[string]interface{}{"err": err.Error()})
		ctx.Abort()
		return
	}

	ctx.JSON(200, map[string]interface{}{
		"data":    project,
		"message": "Tambah Proyek Baru Berhasil",
	})
	ctx.Abort()
}
