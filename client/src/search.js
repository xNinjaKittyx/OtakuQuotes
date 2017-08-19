import React, { Component } from 'react';
import axios from 'axios';
import _ from 'lodash';

class Search extends Component {

  constructor(props) {
    super(props);
    this.state = {
      list: []
    };
  }

  componentWillMount() {
    this.search();
  }

  search(query="Fate") {
    axios.get(`http://69.181.250.99:3000/api/quotes?tags=${query}`)
      .then((response) => {
        this.setState({list: response.data.quotes}, function(){
          console.log(this.state);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  textChange(){
    this.search(this.refs.query.value);
  }

  render() {
    var quotelist = _.map(this.state.list, (x) => {
      return <tr><td>{x.anime}</td><td>{x.character}</td><td>{x.quote}</td></tr>;
    });
    return (
      <div className="container">
        <input ref="query" onChange={ (e) => { this.textChange(); } } type="text" />
        <h2> {this.state.list.anime} </h2>
        <table className="table">
          <thead>
            <tr>
              <th>Anime</th>
              <th>Character</th>
              <th>Quote</th>
            </tr>
          </thead>
        <tbody>
        {quotelist}
        </tbody>
        </table>
      </div>
    );
  }
}

export default Search;