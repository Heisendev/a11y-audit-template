package postgres

import (
	"log"

	"github.com/heisendev/a11y-audit-template/internal/models"
	"github.com/jinzhu/gorm"
)

// AuditModel object
type AuditModel struct {
	DB *gorm.DB
}

// Get all audits
func (m *AuditModel) GetAll() []*models.Audit {
	audits := []*models.Audit{}
	m.DB.Find(&audits)
	return audits
}

func (m *AuditModel) Create(a *models.Audit) models.Audit {
	if a == nil {
		log.Fatal(a)
	}
	audit := models.Audit{Name: a.Name, Values: a.Values}
	m.DB.Create(&audit)
	return audit
}
