import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Navmenu extends Component {

  constructor() {
    super();
    this.state = {
        navmenuOpen: false,
        value:''
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
    handleClick() {
    this.setState({
      navmenuOpen: !this.state.navmenuOpen,
    });

  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  render() {
    let openstate = this.state.navmenuOpen ? "navbar-menu is-active" : "navbar-menu"

    return (
      <div>
      <nav className="navbar navigation">
        <div className="container">
        <div className="navbar-brand">
          <Link to='/' className="navbar-item white">OtakuQuotes</Link>
            <div className="field has-addons controltop">
              <div className="control">
                <input className="input" placeholder="Search" value={this.state.value} onChange={this.handleChange}/>
              </div>
              <div className="control">
                <Link to={{
            pathname: '/search',
            search: '?tags=' + this.state.value
          }} className="button is-primary" onClick={this.forceUpdate}>
                  <span className="icon is-small is-left">
                      <i className="fa fa-search"></i>
                  </span>
                  </Link>
              </div>
            </div>
          <div className="navbar-burger white" onClick={this.handleClick}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <div className={openstate}>
          <div className="navbar-end">
            <Link to='/about' className="navbar-item white">About</Link>
            <Link to='/pending' className="navbar-item white">Pending</Link>
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
      </nav>
      </div>
    );
  }
}

export default Navmenu;