package controller

import (
	"backend/src/database"
	"backend/src/model"

	"github.com/gin-gonic/gin"
)

func GetEmployee(ctx *gin.Context) {
	var employee model.Employee
	err := database.Conn.Table("employee").Where("id = ?", 1).First(&employee).Error
	if err != nil {
		ctx.JSON(404, map[string]interface{}{"err": "not found"})
		ctx.Abort()
		return
	}

	ctx.JSON(200, map[string]interface{}{"data": employee})
	ctx.Abort()
}

func SaveEmployee(ctx *gin.Context) {
	var request struct {
		Name string  `json:"name" binding:"required"`
		Rate float32 `json:"rate" binding:"required"`
	}

	if err := ctx.ShouldBindJSON(&request); err != nil {
		ctx.JSON(400, map[string]interface{}{"err": "Bad request"})
		ctx.Abort()
		return
	}

	employee := model.Employee{
		ID:   1, // static id for upsert
		Name: request.Name,
		Rate: request.Rate,
	}

	err := database.Conn.Table("employee").Save(&employee).Error
	if err != nil {
		ctx.JSON(500, map[string]interface{}{"err": err.Error()})
		ctx.Abort()
		return
	}

	ctx.JSON(200, map[string]interface{}{
		"message": "Data karyawan berhasil disimpan",
	})
	ctx.Abort()
}
