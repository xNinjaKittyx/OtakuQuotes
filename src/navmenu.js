import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Navmenu extends Component {

  constructor(props) {
    super(props);
    this.state = {active: false};
  }

  toggleMobile() {
    this.setState({active: true});
  }

  render() {
    return (
      <div className="container">
        <div className="nav-left">
          <Link to='/' className="nav-item">OtakuQuotes</Link>
        </div>
        <span className="nav-toggle" onClick={this.toggleMobile.bind(this)}>
          <span></span>
          <span></span>
          <span></span>
        </span>
        <div className={"nav-right nav-menu " + (this.props.active ? 'is-active' : '')}>
          <Link to='/pending' className="nav-item">Pending</Link>
          <Link to='/search' className="nav-item">Search</Link>
          <Link to='/docs' className="nav-item">Docs</Link>
          <Link to='/submit' className="nav-item">Submit</Link>
          <span className="nav-item">
            <a className="button is-success is-inverted">
              <span className="icon">
                <i className="fa fa-github"></i>
              </span>
              <span>Github</span>
            </a>
          </span>
        </div>
      </div>
    );
  }
}

export default Navmenu;