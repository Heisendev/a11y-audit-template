import React, { useState } from "react";
import { Field, Formik } from "formik";
import wcag from 'wcag-as-json/src/wcag.json';
import { PDFDownloadLink } from '@react-pdf/renderer';
import MyDocument from '../pdf/pdf';

const Form = (): JSX.Element => {

  const [criteriaOpened, openCriteria] = useState(['']);

  const toggleCriteria = (criteriaId: string) => {
    if (criteriaOpened.includes(criteriaId)) {
      openCriteria(criteriaOpened.filter(crit => crit !== criteriaId));
    } else {
      openCriteria([...criteriaOpened, criteriaId]);
    }
  };

  const normalizeWcagId = (id: string) => {
    return id.replace(/\./g, '_');
  }

  const [isPdfDisplayed, displayPDF] = useState(false);
  const [formValues, stateValues] = useState({});

  return (
    <div>
      { isPdfDisplayed ?
          <PDFDownloadLink document={<MyDocument values={formValues} />} fileName="somename.pdf">
            {({ blob, url, loading, error }) =>
              loading ? 'Loading document...' : 'Download now!'
            }
          </PDFDownloadLink>
        :
        <Formik
          initialValues={{} as { [s: string]: unknown; }}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              console.log(values);
              stateValues(values);
              displayPDF(true);
              setSubmitting(false);
            }, 400);
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
          }) => (
            <form onSubmit={handleSubmit}>
              {wcag.map(wcag => {
                return (
                  <div key={wcag.ref_id}>
                    <h2>{wcag.title}</h2>
                    {
                      wcag.guidelines.map(guideline => {
                        return (
                          <div key={guideline.ref_id} className="guideline">
                            <h3>{guideline.ref_id} {guideline.title}</h3>
                            {guideline.success_criteria.map((criteria, index, criterias) => {
                              const critOpen = criteriaOpened.includes(`more-${criteria.ref_id}`)
                              return (
                                <div key={criteria.ref_id}>
                                  <h4 id={`criteria-${criteria.ref_id}`}>{`${criteria.ref_id}: Level ${criteria.level} - ${criteria.title}`}</h4>
                                  <div className="criteria-description">{criteria.description}</div>
                                  <div role="group" aria-labelledby={`criteria-${criteria.ref_id}`}>
                                    <label>
                                      <Field type="radio" name={normalizeWcagId(criteria.ref_id)} value="success" />
                                      Success
                                    </label>
                                    <label>
                                      <Field type="radio" name={normalizeWcagId(criteria.ref_id)} value="failed" />
                                        Failed
                                    </label>
                                    {values[normalizeWcagId(criteria.ref_id)] === "failed" && 
                                      <div>
                                        <label htmlFor={`comment-${normalizeWcagId(criteria.ref_id)}`}></label>
                                        <Field
                                          type="textarea"
                                          name={`comment-${normalizeWcagId(criteria.ref_id)}`}
                                          id={`comment-${normalizeWcagId(criteria.ref_id)}`} />
                                    </div>
                                    }
                                  </div>
                                  <button
                                    type="button"
                                    aria-controls={`more-${criteria.ref_id}`}
                                    aria-expanded={critOpen ? 'true' : 'false'}
                                    className="accordion-header"
                                    onClick={() => toggleCriteria(`more-${criteria.ref_id}`)}> See how to acheive criteria </button>
                                  <div id={`more-${criteria.ref_id}`} role="region" className="accordion-panel" hidden={critOpen ? false : true}>
                                    {criteria.references.map((ref: { url?: string | undefined; title: string; }, index: number) => {
                                      return (<div key={index}><a href={ref?.url} target="_blank" rel="noreferrer">{ref?.title}</a></div>)
                                    })}
                                  </div>
                                  {(index !== criterias.length - 1) && <hr />}
                                </div>
                              )
                            })}
                          </div>
                        )
                      })
                    }
                  </div>
                )
              })}
              <button type="submit" disabled={isSubmitting}>
                Generate report PDF
          </button>
            </form>
          )}
        </Formik>}
    </div>
  )
};

export default Form;
