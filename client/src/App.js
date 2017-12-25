import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';

import Search from './components/search.js';
import Random from './components/random.js';
import Submit from './components/submit.js';
import Navmenu from './components/navmenu.js';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <Router>
        <div className="App">
          <Navmenu/>
          <Switch>
            <Route exact path='/' component={Home}/>
            <Route path='/search?=' component={Search} />
            <Route path='/about' component={About}/>
            <Route path='/docs' component={Docs}/>
            <Route path='/submit' component={Submit}/>
            <Route component={NoMatch} />
          </Switch>
        </div>
      </Router>
    );
  }
}

const Home = () => (
  <div>
  <section className="hero is-primary is-medium" id="heroback">
  <div className="hero-body">
    <div className="container has-text-centered">
      <h1 className="title">
        OtakuQuotes
      </h1>
      <h2 className="subtitle">
        A RESTful API to grab your favorite quotes to show your power level!
      </h2>
      <br />
      <Random />
      <br />
      <p className="hero-buttons">
        <Link to='/search' className="button is-mainbutton is-large">
          <span>Try It Out!</span>
        </Link>
        <Link to='/docs' className="button is-secondbutton is-large">
          <span>View Docs</span>
        </Link>
      </p>
    </div>
  </div>
  </section>
  </div>
)

const About = () => (
  <div className="container">
    <h1 className="title">About</h1>

  </div>
);

const Docs = () => (
  <div className="container">
    <h1 className="title">Documentation</h1>

  </div>
);

const NoMatch = () => (
  <div className="container">
    <h1 className="title">Websites die when they are killed.</h1>
    <h1 className="subtitle"> - 404</h1>
  </div>
);

export default App;