package compute

import (
	"fmt"
	"math"
	"time"
)

type DateContext struct {
	StartDate time.Time
	EndDate   time.Time
}

type Options struct {
	Dates         []DateContext
	StartWorkTime int
	EndWorkTime   int
	Overtime      float64
	Rate          float64
}

type Compute struct {
	TotalDuration       string
	TotalDurationSecond int
	TotalOverTime       string
	TotalOverTimeSecond int
	Income              float64
	OvertimeIncome      float64
	TotalIncome         float64
	options             Options
}

func New(options Options) *Compute {
	compute := &Compute{options: options}
	compute.calculateTotalDuration()
	compute.calculateTotalOverTime()
	compute.calculateIncome()
	compute.calculateOvertimeIncome()
	compute.calculateTotalIncome()
	return compute
}

func (c *Compute) formatDuration(seconds int) string {
	isNegative := seconds < 0
	d := math.Abs(float64(seconds))
	days := int(math.Floor(d / (60 * 60 * 24)))
	hours := int(math.Floor(math.Mod(d, (60*60*24)) / (60 * 60)))
	minutes := int(math.Floor(math.Mod(d, (60*60)) / 60))

	durationStr := ""
	if days != 0 {
		durationStr += fmt.Sprintf("%d hari ", days)
	}
	if hours != 0 {
		durationStr += fmt.Sprintf("%d jam ", hours)
	}
	if minutes != 0 {
		durationStr += fmt.Sprintf("%d menit", minutes)
	}

	if isNegative {
		durationStr = "-" + durationStr
	}

	return durationStr
}

func (c *Compute) calculateTotalDuration() {
	for _, interval := range c.options.Dates {
		c.TotalDurationSecond += int(interval.EndDate.Sub(interval.StartDate).Seconds())
	}
	c.TotalDuration = c.formatDuration(c.TotalDurationSecond)
}

func (c *Compute) calculateTotalOverTime() {
	for _, interval := range c.options.Dates {
		start := interval.StartDate
		end := interval.EndDate

		// If total duration < overtime skip
		totalDuration := end.Sub(start).Seconds()
		if totalDuration <= c.options.Overtime {
			continue
		}

		// If the start time is before 09:00, calculate the difference to 09:00
		if start.Hour() < c.options.StartWorkTime {
			startOvertime := time.Date(start.Year(), start.Month(), start.Day(), c.options.StartWorkTime, 0, 0, 0, start.Location()).Sub(start).Seconds()
			c.TotalOverTimeSecond += int(startOvertime)
			start = time.Date(start.Year(), start.Month(), start.Day(), c.options.StartWorkTime, 0, 0, 0, start.Location())
		}

		// If the end time is after 17:00, calculate the difference from 17:00
		if end.Hour() >= c.options.EndWorkTime {
			endOvertime := end.Sub(time.Date(end.Year(), end.Month(), end.Day(), c.options.EndWorkTime, 0, 0, 0, end.Location())).Seconds()
			c.TotalOverTimeSecond += int(endOvertime)
			end = time.Date(end.Year(), end.Month(), end.Day(), c.options.EndWorkTime, 0, 0, 0, end.Location())
		}

		// Calculate the duration within the work hours and check for overtime
		if end.After(start) {
			duration := end.Sub(start).Seconds()
			if duration > float64(c.options.Overtime) {
				c.TotalOverTimeSecond += int(duration - float64(c.options.Overtime))
			}
		}
	}
	c.TotalOverTime = c.formatDuration(c.TotalOverTimeSecond)
}

func (c *Compute) calculateIncome() {
	var totalWorkSeconds int

	for _, interval := range c.options.Dates {
		start := interval.StartDate
		end := interval.EndDate

		// Adjust start time if before 09:00
		if start.Hour() < c.options.StartWorkTime {
			start = time.Date(start.Year(), start.Month(), start.Day(), c.options.StartWorkTime, 0, 0, 0, start.Location())
		}

		// Adjust end time if after 17:00
		if end.Hour() >= c.options.EndWorkTime {
			end = time.Date(end.Year(), end.Month(), end.Day(), c.options.EndWorkTime, 0, 0, 0, end.Location())
		}

		// Ensure we only count duration within working hours
		if end.After(start) {
			totalWorkSeconds += int(end.Sub(start).Seconds())
		}
	}

	totalHours := float64(totalWorkSeconds) / 3600
	c.Income = totalHours * c.options.Rate
}

func (c *Compute) calculateOvertimeIncome() {
	totalOvertimeHours := float64(c.TotalOverTimeSecond) / 3600
	c.OvertimeIncome = totalOvertimeHours * c.options.Rate * 0.3
}

func (c *Compute) calculateTotalIncome() {
	c.TotalIncome = c.Income + c.OvertimeIncome
}
