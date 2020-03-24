import React, { Component } from 'react';
import { Form, Container, OverlayTrigger, Tooltip } from 'react-bootstrap';
import StrategyList from './StrategyList';


class StrategyBox extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.text_value = React.createRef();
    this.handle_expressions = (val) => {
      this.props.type == "buy" ? this.props.handle_expressions(this.text_value.current.value, "") : this.props.handle_expressions("", this.text_value.current.value);
    }
  }

  render() {
    return (
      <Container>
        <h1>{this.props.title}</h1>
        <Form>
          <Form.Group>
            <Form.Label>Expression</Form.Label>
            <OverlayTrigger
              key={"top"}
              placement={"top"}
              overlay={
                <Tooltip id={`tooltip-${"top"}`}>
                  You can use strategies (s0, s1, ecc) and symbols (&, (, ), |)
                </Tooltip>
              }
            >
            <Form.Control ref={this.text_value} placeholder="S0|(S1&S2)" onChange={this.handle_expressions} />
            </OverlayTrigger>
          </Form.Group>
        </Form>
        <StrategyList type={this.props.type} add_strategy={this.props.add_strategy} strategy_parameters={this.props.strategy_parameters} />
      </Container>
    )
  }
}

export default StrategyBox;
