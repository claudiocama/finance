import React, { Component } from 'react';
import { Form, Container, Row, Col } from 'react-bootstrap';
import Strategy from './components/Strategy';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <React.Fragment>
        <Strategy />
      </React.Fragment>
    )
  }
}

export default App;
