import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './pages/Home';
import App from './pages/Poker';
import './App.css'

const AppCards = () => {
    return (
        <Router>
            <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/poker" component={App} />
            </Switch>
        </Router>
    );
};

export default AppCards;
