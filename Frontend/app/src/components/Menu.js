import React, { Component } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Container style={{ marginTop: "3%"}}>
      <Navbar className="rounded mb-0" bg="primary" variant="dark">
        <Nav className="mr-auto">
          <Nav.Link onClick={() => this.props.changePage("strategy")}>Strategy Backtest</Nav.Link>
          <Nav.Link onClick={() => this.props.changePage("montecarlo")}>Montecarlo portfolio</Nav.Link>
        </Nav>
      </Navbar>
      </Container>
    )
  }
}

export default Menu;
