package common

import (
	"backend/src/packages/timetz"
	"fmt"
	"log"
	"os"
	"strings"
	"time"

	"github.com/joho/godotenv"
)

func Env(key string) string {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal(".env file not found")
	}
	return os.Getenv(strings.ToUpper(key))
}

func ParseDate(dateStr string) time.Time {
	parse, _ := time.Parse("2006-01-02", dateStr)
	return parse
}

func ParseTimeTZ(timeStr string) timetz.Time {
	parsedTime, _ := time.Parse("15:04", timeStr)
	return timetz.Time{Time: parsedTime}
}

func SecondsToDuration(seconds int64) string {
	d := time.Duration(seconds) * time.Second

	days := int(d.Hours() / 24)
	hours := int(d.Hours()) % 24
	minutes := int(d.Minutes()) % 60

	durationStr := ""
	if days > 0 {
		durationStr += fmt.Sprintf("%d days ", days)
	}
	if hours > 0 {
		durationStr += fmt.Sprintf("%d hours ", hours)
	}
	if minutes > 0 {
		durationStr += fmt.Sprintf("%d minutes", minutes)
	}

	return durationStr
}
