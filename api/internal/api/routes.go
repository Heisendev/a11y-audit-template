package api

import (
	"net/http"

	"github.com/bmizerany/pat"
	"github.com/justinas/alice"
)

func (app *application) routes() http.Handler {
	standardMiddleware := alice.New(app.recoverPanic, app.logRequest, secureHeaders)
	// TODO: Use alice to add authentication middleware
	dynamicMiddleware := alice.New()

	mux := pat.New()
	mux.Get("/", dynamicMiddleware.ThenFunc(app.home))
	mux.Get("/audits", dynamicMiddleware.ThenFunc(app.showAudits))
	mux.Post("/audit", dynamicMiddleware.ThenFunc(app.createAudit))
	return standardMiddleware.Then(mux)
}
