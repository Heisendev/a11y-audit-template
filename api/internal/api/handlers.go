package api

import (
	"encoding/json"
	"fmt"
	"html"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/heisendev/a11y-audit-template/internal/models"
)

func (app *application) home(w http.ResponseWriter, r *http.Request) {
	_, err := w.Write([]byte(fmt.Sprintf("Hello there.. %q", html.EscapeString(r.URL.Path))))
	if err != nil {
		app.errorLog.Fatal(err)
	}
}

func (app *application) showAudits(w http.ResponseWriter, r *http.Request) {
	audits := app.audits.GetAll()

	js, err := json.Marshal(audits)
	if err != nil {
		app.errorLog.Printf("%s %d", err.Error(), http.StatusInternalServerError)
		return
	}

	_, err = w.Write(js)
	if err != nil {
		app.errorLog.Fatal(err)
	}
}

func (app *application) createAudit(w http.ResponseWriter, r *http.Request) {

	body, err := ioutil.ReadAll(r.Body)

	if err != nil {
		log.Fatal(err)
	}

	var audit models.Audit

	err = json.Unmarshal(body, &audit)

	if err != nil {
		log.Fatal(err)
	}

	app.audits.Create(&audit)

	json.NewEncoder(w).Encode(audit)

}
