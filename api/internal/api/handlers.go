package api

import (
	"encoding/json"
	"fmt"
	"html"
	"net/http"
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
