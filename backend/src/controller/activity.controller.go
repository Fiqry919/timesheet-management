package controller

import (
	c "backend/src/common"
	"backend/src/database"
	"backend/src/model"
	"backend/src/packages/compute"
	"log"
	"time"

	"github.com/gin-gonic/gin"
)

func GetActivity(ctx *gin.Context) {
	var request struct {
		Filter []int `json:"filter" binding:"omitempty"`
	}

	if ctx.Request.ContentLength != 0 {
		if err := ctx.ShouldBindJSON(&request); err != nil {
			ctx.JSON(400, map[string]interface{}{"err": err.Error()})
			ctx.Abort()
			return
		}
	}

	var employee model.Employee
	err := database.Conn.Table("employee").Where("id = ?", 1).First(&employee).Error
	if err != nil {
		ctx.JSON(400, map[string]interface{}{"err": "not found"})
		ctx.Abort()
		return
	}

	var activity []model.Activity
	query := database.Conn.Table("activity").
		Where("employee_id = ?", employee.ID)

	if request.Filter != nil {
		log.Println(request.Filter)
		query = query.Where("project_id IN (?)", request.Filter)
	}

	err = query.Order("created_at ASC").Preload("Project").Find(&activity).Error
	if err != nil {
		ctx.JSON(500, map[string]interface{}{"err": err.Error()})
		ctx.Abort()
		return
	}

	options := compute.Options{
		StartWorkTime: 9,
		EndWorkTime:   17,
		Overtime:      8 * 60 * 60, // 8 hours
		Rate:          float64(employee.Rate),
	}
	for _, v := range activity {
		startDateTime := v.StartDate.Add(time.Duration(v.StartTime.Hour()) * time.Hour).
			Add(time.Duration(v.StartTime.Minute()) * time.Minute).
			Add(time.Duration(v.StartTime.Second()) * time.Second)

		endDateTime := v.EndDate.Add(time.Duration(v.EndTime.Hour()) * time.Hour).
			Add(time.Duration(v.EndTime.Minute()) * time.Minute).
			Add(time.Duration(v.EndTime.Second()) * time.Second)

		options.Dates = append(options.Dates, struct {
			StartDate time.Time
			EndDate   time.Time
		}{StartDate: startDateTime, EndDate: endDateTime})
	}

	compute := compute.New(options)

	ctx.JSON(200, map[string]interface{}{
		"total_duration":  compute.TotalDuration,
		"total_overtime":  compute.TotalOverTime,
		"income":          compute.Income,
		"overtime_income": compute.OvertimeIncome,
		"total_income":    compute.TotalIncome,
		"data":            activity,
	})
	ctx.Abort()
}

func SaveActivity(ctx *gin.Context) {
	var request struct {
		ID         int    `json:"id"`
		EmployeeID int    `json:"employe_id" binding:"required"`
		Title      string `json:"title" binding:"required"`
		ProjectID  int    `json:"project_id" binding:"required"`
		StartDate  string `json:"start_date" binding:"required"`
		EndDate    string `json:"end_date" binding:"required"`
		StartTime  string `json:"start_time" binding:"required"`
		EndTime    string `json:"end_time" binding:"required"`
	}

	if err := ctx.ShouldBindJSON(&request); err != nil {
		ctx.JSON(400, map[string]interface{}{"err": err.Error()})
		ctx.Abort()
		return
	}

	var project model.Project
	err := database.Conn.Table("project").Where("id = ?", request.ProjectID).
		First(&project).Error
	if err != nil {
		log.Println(err.Error())
		ctx.JSON(400, map[string]interface{}{"err": "Bad request"})
		ctx.Abort()
		return
	}

	activity := model.Activity{
		ID:         uint(request.ID),
		Title:      request.Title,
		EmployeeID: uint(request.EmployeeID),
		Project:    project,
		StartDate:  c.ParseDate(request.StartDate),
		EndDate:    c.ParseDate(request.EndDate),
		StartTime:  c.ParseTimeTZ(request.StartTime),
		EndTime:    c.ParseTimeTZ(request.EndTime),
	}
	if err := database.Conn.Save(&activity).Error; err != nil {
		log.Println(err.Error())
		ctx.JSON(500, map[string]interface{}{"err": err.Error()})
		ctx.Abort()
		return
	}

	ctx.JSON(200, map[string]interface{}{
		"data":    activity,
		"message": "Tambah Kegiatan Baru Berhasil",
	})
	ctx.Abort()
}

func DeleteActivity(ctx *gin.Context) {
	id := ctx.Param("id")

	var activity model.Activity
	err := database.Conn.Table("activity").Where("id = ?", id).
		Delete(&activity).Error
	if err != nil {
		ctx.JSON(404, map[string]interface{}{"err": "not found"})
		ctx.Abort()
		return
	}

	ctx.JSON(200, map[string]interface{}{
		"message": "Data kegiatan berhasil dihapus",
	})
	ctx.Abort()
}
