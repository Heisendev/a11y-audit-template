import React from 'react';
import axios from 'axios';
import { Field, Form, Formik } from 'formik';

import { API_URL } from '../../constants';

const submitHandler = (values: { name: string }) => {
    axios
        .post(`${API_URL}audit`, values)
        .then(() => {
            document.location.href = `${API_URL}/audits/${values.name}`;
        })
        .catch(() => {
            axios.get(`${API_URL}audits`).then((res) => {
                console.log(res);
            });
        });
};

const Home = (): JSX.Element => {
    return (
        <Formik initialValues={{ name: '' }} onSubmit={(values) => submitHandler(values)}>
            <Form>
                <label htmlFor="name">audit name</label>
                <Field type="text" name="name" id="name" />
                <input type="submit" value="start a new audit" />
            </Form>
        </Formik>
    );
};

export default Home;
