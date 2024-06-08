package timetz

import (
	"database/sql/driver"
	"fmt"
	"time"
)

type Time struct {
	time.Time
}

func (t *Time) Scan(value interface{}) error {
	switch v := value.(type) {
	case time.Time:
		*t = Time{v}
	case string:
		parsedTime, err := time.Parse("15:04:05-07", v)
		if err != nil {
			return err
		}
		*t = Time{parsedTime}
	case []byte:
		parsedTime, err := time.Parse("15:04:05-07", string(v))
		if err != nil {
			return err
		}
		*t = Time{parsedTime}
	default:
		return fmt.Errorf("cannot scan type %T into Time: %v", value, value)
	}
	return nil
}

func (t Time) Value() (driver.Value, error) {
	return t.Format("15:04:05-07"), nil
}
