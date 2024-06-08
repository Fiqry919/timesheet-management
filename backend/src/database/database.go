package database

import (
	c "backend/src/common"
	"fmt"
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var Conn *gorm.DB

func init() {
	db, err := new()
	if err != nil {
		panic("failed to connect database")
	}

	log.Println("Database connected")
	if c.Env("AUTO_MIGRATE") != "false" { // default auto migrate
		db.AutoMigrate(*Schema...)
	}

	Conn = db
}

func new() (*gorm.DB, error) {
	dsn := fmt.Sprintf("host=%s port=%s dbname=%s user=%s password=%s sslmode=disable",
		c.Env("DB_HOST"),
		c.Env("DB_PORT"),
		c.Env("DB_NAME"),
		c.Env("DB_USERNAME"),
		c.Env("DB_PASSWORD"),
	)
	return gorm.Open(postgres.Open(dsn), &gorm.Config{
		// configuration
	})
}
