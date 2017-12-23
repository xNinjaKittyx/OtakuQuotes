import React, { Component } from 'react';
import _ from 'lodash';

const quotetag = tag => `http://otakuquotes.com/api/pending`

class Pending extends Component {

  constructor(props) {
    super(props);
    this.state = {
        requestFailed: false
    };
  }

  componentDidMount() {
    fetch(quotetag(this.props.tag))
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
        })
  }

  render() {
    if (this.state.requestFailed) return <p>Failed</p>
    if (!this.state.quotes) return <p>Loading...</p>
    var pendingquotes = _.map(this.state.quotes.quotes, (x) => {
      return <tr key={x.id}><td>{x.anime}</td><td>{x.char}</td><td>{x.quote}</td><td>{x.episode}</td><td>{x.submitter}</td></tr>;
    });
    return (
      <div className="container">
        <table className="table">
          <thead>
            <tr>
              <th>Anime</th>
              <th>Character</th>
              <th>Quote</th>
              <th>Episode</th>
              <th>Submitter</th>
            </tr>
          </thead>
        <tbody>
        {pendingquotes}
        </tbody>
        </table>
      </div>
    );
  }
}

export default Pending;