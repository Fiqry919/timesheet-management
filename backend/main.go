package main

import (
	c "backend/src/common"
	_ "backend/src/database"
	"backend/src/middleware"
	"backend/src/routes"
	"fmt"
	"log"

	"github.com/gin-gonic/gin"
)

func main() {
	gin.SetMode(gin.ReleaseMode)
	app := gin.Default()

	app.Use(middleware.Cors())
	routes.Api(app)

	host := fmt.Sprintf("%s:%s", c.Env("host"), c.Env("port"))
	log.Println("listening on", host)
	if err := app.Run(host); err != nil {
		log.Fatalf("failed start server: %s\n", err)
	}
}
