package postgres

import (
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
