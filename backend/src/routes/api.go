package routes

import (
	"backend/src/controller"

	"github.com/gin-gonic/gin"
)

func Api(route *gin.Engine) {
	route.GET("/", controller.Home)

	// employee
	route.GET("/employee", controller.GetEmployee)
	route.POST("/employee", controller.SaveEmployee)
	// project
	route.GET("/project", controller.GetProject)
	route.POST("/project", controller.AddProject)
	// activity
	route.POST("/activity", controller.GetActivity)
	route.POST("/activity/save", controller.SaveActivity)
	route.POST("/activity/:id", controller.DeleteActivity)

	route.NoRoute(controller.NotFound)
}
