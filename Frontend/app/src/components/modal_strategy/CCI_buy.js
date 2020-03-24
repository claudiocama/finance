import React, { Component } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';

class CCI_buy extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.text_value = React.createRef();
    this.add_strategy = () => {
      this.props.add_strategy({"name":"CCI_buy_Strategy", "parameter":{"value":parseInt(this.text_value.current.value)}, "type":"buy"});
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
              <Form.Label>Buy if CCI is lower than</Form.Label>
              <Form.Control ref={this.text_value} placeholder="-100" />
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

export default CCI_buy;
