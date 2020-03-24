import React, { Component } from 'react';

class StrategyItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <React.Fragment>
        <h1>{this.props.name}</h1>
        <p>{this.props.parameters.name} {JSON.stringify(this.props.parameters.parameter)}</p>
      </React.Fragment>
    )
  }
}

export default StrategyItem;
