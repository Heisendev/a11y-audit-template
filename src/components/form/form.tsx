import React, { useState } from "react";
import { Field, Formik } from "formik";
import wcag from 'wcag-as-json/src/wcag.json';
import { PDFDownloadLink } from '@react-pdf/renderer';
import MyDocument from '../pdf/pdf';
import { normalizeWcagId } from '../../helpers/helpers';

const Form = (): JSX.Element => {

  const [criteriaOpened, openCriteria] = useState(['']);

  const toggleCriteria = (criteriaId: string) => {
    if (criteriaOpened.includes(criteriaId)) {
      openCriteria(criteriaOpened.filter(crit => crit !== criteriaId));
    } else {
      openCriteria([...criteriaOpened, criteriaId]);
    }
  };

  const [isPdfDisplayed, displayPDF] = useState(false);
  const [formValues, stateValues] = useState({});
  const [criteriaLevels, setCriteriaLevels] = useState(['A', 'AA', 'AAA'])

  const handleLevels = (level: string) => {
    if (criteriaLevels.includes(level)) {
      setCriteriaLevels(criteriaLevels.filter(crit => crit !== level));
    } else {
      setCriteriaLevels([...criteriaLevels, level]);
      }
  }

  return (
    <main className="main">
      { isPdfDisplayed ?
          <PDFDownloadLink document={<MyDocument values={formValues} />} fileName="somename.pdf">
            {({ blob, url, loading, error }) =>
              loading ? 'Loading document...' : 'Download now!'
            }
          </PDFDownloadLink>
        :
        <div>
          <fieldset className="wcag-filter">
            <legend>
              WCAG Level filter
            </legend>
            <label>
              <input type="checkbox" id="A" name="criteria-level" checked={criteriaLevels.includes('A')} onChange={() => handleLevels('A')} />
              A
            </label>
            <label>
              <input type="checkbox" id="AA" name="criteria-level" checked={criteriaLevels.includes('AA')} onChange={() => handleLevels('AA')} />
              AA
            </label>
            <label>
              <input type="checkbox" id="AAA" name="criteria-level" checked={criteriaLevels.includes('AAA')} onChange={() => handleLevels('AAA')} />
              AAA
            </label>
          </fieldset>

          <Formik
            initialValues={{} as { [s: string]: unknown; }}
            onSubmit={(values, { setSubmitting }) => {
              setTimeout(() => {
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
                      <p>{wcag.description}</p>
                      {
                        wcag.guidelines.map(guideline => {
                          return (
                            <div key={guideline.ref_id} className="guideline">
                              <h3>{guideline.ref_id} {guideline.title}</h3>
                              {guideline.success_criteria.map((criteria, index, criterias) => {
                                if (criteriaLevels.includes(criteria.level)) {
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
                                          <div className="margin-bottom">
                                            <label className="block" htmlFor={`${normalizeWcagId(criteria.ref_id)}-comment`}>Comment : </label>
                                          <Field
                                              className="full-width"
                                              as="textarea"
                                              name={`${normalizeWcagId(criteria.ref_id)}-comment`}
                                              id={`${normalizeWcagId(criteria.ref_id)}-comment`} />
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
                                          return ref.url ? (<div key={index}><a href={ref.url} target="_blank" rel="noreferrer">{ref.title}</a></div>) : null;
                                        })}
                                      </div>
                                      {(index !== criterias.length - 1) && <hr />}
                                    </div>
                                  )
                                } else {
                                  return null;
                                }
                                
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
          </Formik>
        </div>}
    </main>
  )
};

export default Form;
