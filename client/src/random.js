import React, { Component } from 'react';

class Random extends Component {

  constructor(props) {
    super(props);
    this.state = {
        requestFailed: false
    };
    this.tick = this.tick.bind(this);
  }

  tick() {
    fetch("http://69.181.250.99:3000/api/random")
        .then(response => {
            if (!response.ok) {
                throw Error("Network request failed")
            }
            return response
        })
        .then(d => d.json())
        .then(d => {
            this.setState({
                quotes: d
            })
            console.log(this.state);
        })
  }

  componentDidMount() {
    this.tick();
    this.interval = setInterval(this.tick, 5000);
    
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    if (this.state.requestFailed) return <div className="topkek"><p>Failed</p></div>
    if (!this.state.quotes) return <div className="topkek"><p>Loading...</p></div>
    return (
      <div className="topkek">
        <h2 className="subtitle is-5">"{this.state.quotes.quotes.quote}"</h2>
        <h2 className="subtitle is-6">- {this.state.quotes.quotes.char}</h2>
      </div>
    );
  }
}

export default Random;