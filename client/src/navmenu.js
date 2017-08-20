import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Navmenu extends Component {

  constructor() {
    super();
    this.state = {
        navmenuOpen: false
    };
    this.handleClick = this.handleClick.bind(this);
  }
    handleClick() {
    this.setState({
      navmenuOpen: !this.state.navmenuOpen,
    });
  }

  render() {
    let openstate = this.state.navmenuOpen ? "navbar-menu is-active" : "navbar-menu"
    return (
      <div className="navbar navigation">
      <div className="container">
        <div className="navbar-brand">
          <Link to='/' className="navbar-item white">OtakuQuotes</Link>
        </div>
        <span className="navbar-burger burger" onClick={this.handleClick}>
          <span></span>
          <span></span>
          <span></span>
        </span>
        <div className={openstate}>
          <div className="navbar-end">
          <Link to='/about' className="navbar-item white">About</Link>
          <Link to='/pending' className="navbar-item white">Pending</Link>
          <Link to='/search' className="navbar-item white">Search</Link>
          <Link to='/docs' className="navbar-item white">Docs</Link>
          <Link to='/submit' className="navbar-item white">Submit</Link>
          <span className="navbar-item">
            <a className="button is-success is-inverted" href="https://github.com/xNinjaKittyx/OtakuQuotes">
              <span className="icon">
                <i className="fa fa-github"></i>
              </span>
              <span>Github</span>
            </a>
          </span>
          </div>
        </div>
      </div>
      </div>
    );
  }
}

export default Navmenu;