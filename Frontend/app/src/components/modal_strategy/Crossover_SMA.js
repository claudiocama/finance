import React, { Component } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';

class Crossover_SMA extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.text_fast_value = React.createRef();
    this.text_slow_value = React.createRef();
    this.add_strategy = () => {
      this.props.add_strategy({"name":"Crossover_SMA_Strategy", "parameter":{"fast":this.text_fast_value.current.value, "slow":this.text_slow_value.current.value}, "type":"buy"});
      this.props.close_adding_strategy()
    }
  };
  render(){
    return (
      <Modal centered show={true} onHide={this.props.close_adding_strategy}>
        <Modal.Header closeButton>
          <Modal.Title>Add strategy</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Buy when there is a crossover between these two SMA</Form.Label>
              <Form.Control ref={this.text_fast_value} placeholder="fast" />
              <Form.Label />
              <Form.Control ref={this.text_slow_value} placeholder="slow" />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={this.add_strategy}>
            Add
          </Button>
          <Button variant="secondary" onClick={this.props.close_adding_strategy}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

export default Crossover_SMA;
