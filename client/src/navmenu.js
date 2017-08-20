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
    let openstate = this.state.navmenuOpen ? "nav-right nav-menu is-active" : "nav-right nav-menu"
    return (
      <div className="container">
        <div className="nav-left">
          <Link to='/' className="nav-item">OtakuQuotes</Link>
        </div>
        <span className="nav-toggle" onClick={this.handleClick}>
          <span></span>
          <span></span>
          <span></span>
        </span>
        <div className={openstate}>
          <Link to='/pending' className="nav-item">Pending</Link>
          <Link to='/search' className="nav-item">Search</Link>
          <Link to='/docs' className="nav-item">Docs</Link>
          <Link to='/submit' className="nav-item">Submit</Link>
          <span className="nav-item">
            <a className="button is-success is-inverted" href="https://github.com/xNinjaKittyx/OtakuQuotes">
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