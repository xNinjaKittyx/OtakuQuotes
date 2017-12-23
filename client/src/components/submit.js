import React, { Component } from 'react';

class Submit extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }


  render() {
    return (

    <div className="columns is-mobile">
    <div className="column is-half is-offset-one-quarter">
        <br />
        <h1 className="title">Submit a quote!</h1>
        <div className="field">
        <label className="label">Anime</label>
        <div className="control">
            <input className="input" type="text" placeholder="Name of anime" />
        </div>
        </div>

        <div className="field">
        <label className="label">Character</label>
        <div className="control">
            <input className="input" type="text" placeholder="Name of character" />
        </div>
        </div>

        <div className="field">
        <label className="label">Quote</label>
        <div className="control">
            <textarea className="textarea" placeholder="Quote"></textarea>
        </div>
        </div>

        <div className="field">
        <label className="label">Episode</label>
        <div className="control">
            <input className="input" type="text" placeholder="Episode number" />
        </div>
        </div>

        <div className="field">
        <label className="label">Submitter</label>
        <div className="control">
            <input className="input" type="text" placeholder="Name of submitter" />
        </div>
        </div>

        <div className="field">
        <div className="control">
            <label className="checkbox">
            <input type="checkbox" /> I agree to the <a>terms and conditions</a>
            </label>
        </div>
        </div>

        <div className="field is-grouped">
        <div className="control">
            <button className="button is-primary">Submit</button>
        </div>
        <div className="control">
            <button className="button is-danger">Cancel</button>
        </div>
        </div>
      </div>
    </div>
    );
  }
}

export default Submit;