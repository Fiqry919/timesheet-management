package database

import "backend/src/model"

var Schema = &[]interface{}{
	&model.Employee{},
	&model.Project{},
	&model.Activity{},
}
