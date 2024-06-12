import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './pages/Home/index';
import Poker from './pages/Poker/index';
import Roulette from './pages/Roulette/App';
import './App.css'

const AppCards = () => {
    return (
        <Router>
            <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/poker" component={Poker} />
                <Route exact path="/roulette" component={Roulette} />
            </Switch>
        </Router>
    );
};

export default AppCards;

