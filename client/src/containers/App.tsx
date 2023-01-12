import React from 'react';
import { BrowserRouter as Router, Link, Redirect, Route, Switch } from 'react-router-dom';

import Form from '../components/form/form';

import Home from './Home/Home';

const App = (): JSX.Element => {
    return (
        <div className="App">
            <header className="App-header">
                <h1>Accessibility audit tool</h1>
                <nav>
                    <a href="/">home</a>
                </nav>
            </header>
            <main>
                <Router>
                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route exact path="/audits/:auditId" component={Form} />
                        <Redirect to="/" />
                    </Switch>
                </Router>
            </main>
            <footer>footer</footer>
        </div>
    );
};

export default App;
