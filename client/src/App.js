import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';

import Pending from './quotes.js';
import Search from './search.js';
import Random from './random.js';
import Submit from './submit.js';
import Navmenu from './navmenu.js';

class FadeIn extends Component {

  componentDidMount() {
    console.log("componentDidMount", this.displayName);
    var that = this;
    // Get the components DOM node
    var elem = ReactDOM.findDOMNode(that);
    // Set the opacity of the element to 0
    elem.style.opacity = 0;
    window.requestAnimationFrame(function () {
      // Now set a transition on the opacity
      elem.style.transition = that.props.transition || "opacity 5000ms";
      // and set the opacity to 1
      elem.style.opacity = 1;
    });
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    )
  }
}

const MatchWithFade = ({ component: Component, transition, ...rest }) => (
  <Route {...rest} render={(matchProps) => (
    <FadeIn transition={transition}>
      <Component {...matchProps} />
    </FadeIn>
  )} />
)

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
          <Navmenu />
          <Switch>
            <MatchWithFade exact path='/' component={Home} transition="opacity 3000ms"/>
            <MatchWithFade path='/search' component={Search} transition="opacity 3000ms"/>
            <MatchWithFade path='/about' component={About} transition="opacity 3000ms"/>
            <MatchWithFade path='/pending' component={Pending} transition="opacity 3000ms"/>
            <MatchWithFade path='/docs' component={Docs} transition="opacity 3000ms"/>
            <MatchWithFade path='/submit' component={Submit} transition="opacity 3000ms"/>
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
        A RESTFUL API to grab your favorite quotes to show your power level!
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