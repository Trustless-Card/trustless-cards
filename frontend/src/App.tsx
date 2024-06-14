import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './pages/home/home';
import Poker from './pages/poker/page';
import './App.css'

const AppCards = () => {
    return (
        <Router>
            <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/poker" component={Poker} />
            </Switch>
        </Router>
    );
};

export default AppCards;
