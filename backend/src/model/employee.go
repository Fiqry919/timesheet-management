package model

import (
	"time"

	"gorm.io/gorm"
)

type Employee struct {
	ID         uint           `json:"id" gorm:"primaryKey"`
	Name       string         `json:"name" gorm:"not null;default:null;type:varchar;"`
	Rate       float32        `json:"rate" gorm:"not null;default:null;type:decimal(10,2);"`
	CreatedAt  *time.Time     `json:"created_at,omitempty" gorm:"<-:create"`
	UpdatedAt  *time.Time     `json:"updated_at,omitempty"`
	DeletedAt  gorm.DeletedAt `json:"-" gorm:"index"`
	Activities []Activity     `json:"Activities,omitempty" gorm:"foreignKey:EmployeeID"`
}

func (Employee) TableName() string {
	return "employee"
}
