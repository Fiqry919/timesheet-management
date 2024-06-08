package model

import "time"

type Project struct {
	ID         uint       `json:"id" gorm:"primaryKey"`
	Name       string     `json:"name" gorm:"not null;default:null;type:varchar;"`
	CreatedAt  *time.Time `json:"created_at,omitempty" gorm:"<-:create"`
	UpdatedAt  *time.Time `json:"updated_at,omitempty"`
	Activities []Activity `json:"-" gorm:"foreignKey:ProjectID"`
}

func (Project) TableName() string {
	return "project"
}
