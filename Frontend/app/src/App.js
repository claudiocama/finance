import React, { Component } from 'react';
import { Form, Container, Row, Col } from 'react-bootstrap';
import Strategy from './components/Strategy';
import Montecarlo from './components/Montecarlo';
import Menu from './components/Menu';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {"page": "strategy"};
    this.changePage = (page) => {
      this.setState({"page": page})
    }
  }

  render_home(){
    switch(this.state.page) {
      case "strategy":
        return <Strategy />
      case "montecarlo":
        return <Montecarlo />
      default:
        return ""
    }
  }
  render() {
    return (
      <React.Fragment>
        <Menu page={this.state.page} changePage={this.changePage} />
        {this.render_home()}
      </React.Fragment>
    )
  }
}

export default App;
