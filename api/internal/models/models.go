package models

type Audit struct {
	ID     uint   `json:"id"`
	Name   string `json:"name"`
	Values string `json:"values"`
}

type Criteria struct {
	ID          uint   `json:"ref_id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Level       string `json:"level"`
	Url         string `json:"url"`
}
