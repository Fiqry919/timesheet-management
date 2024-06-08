package model

import (
	"backend/src/packages/timetz"
	"time"

	"gorm.io/gorm"
)

type Activity struct {
	ID         uint        `json:"id" gorm:"primaryKey"`
	EmployeeID uint        `gorm:"not null;default:null" json:"-"`
	Title      string      `json:"title" gorm:"not null;default:null;type:varchar;"`
	ProjectID  uint        `gorm:"not null;default:null" json:"-"`
	StartDate  time.Time   `json:"start_date" gorm:"not null;default:null;type:date;"`
	EndDate    time.Time   `json:"end_date" gorm:"not null;default:null;type:date;"`
	StartTime  timetz.Time `json:"start_time" gorm:"not null;default:null;type:timetz;"`
	EndTime    timetz.Time `json:"end_time" gorm:"not null;default:null;type:timetz;"`
	Duration   int64       `json:"duration" gorm:"not null;default:null;"`
	CreatedAt  *time.Time  `json:"created_at,omitempty" gorm:"<-:create"`
	UpdatedAt  *time.Time  `json:"updated_at,omitempty"`
	Employee   Employee    `gorm:"foreignKey:EmployeeID;" json:"-"`
	Project    Project     `gorm:"foreignKey:ProjectID;" json:"project"`
}

func (Activity) TableName() string {
	return "activity"
}

// hooks BeforeCreate
func (m *Activity) BeforeCreate(tx *gorm.DB) (err error) {
	m.calculateDuration()
	return
}

// hooks BeforeUpdate
func (m *Activity) BeforeUpdate(tx *gorm.DB) (err error) {
	m.calculateDuration()
	return
}

func (m *Activity) calculateDuration() {
	// combine start date and start time
	startDateTime := time.Date(m.StartDate.Year(), m.StartDate.Month(), m.StartDate.Day(),
		m.StartTime.Hour(), m.StartTime.Minute(), m.StartTime.Second(), m.StartTime.Nanosecond(), m.StartTime.Location())

	// combine end date and end time
	endDateTime := time.Date(m.EndDate.Year(), m.EndDate.Month(), m.EndDate.Day(),
		m.EndTime.Hour(), m.EndTime.Minute(), m.EndTime.Second(), m.EndTime.Nanosecond(), m.EndTime.Location())

	// calculate to seconds
	duration := endDateTime.Sub(startDateTime)
	m.Duration = int64(duration.Seconds())
}
