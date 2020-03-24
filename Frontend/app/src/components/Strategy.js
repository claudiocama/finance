import React, { Component } from 'react';
import { Form, Container, Row, Col, Button } from 'react-bootstrap';
import StrategyBox from './StrategyBox';

class Strategy extends Component {
  constructor(props) {
    super(props);
    this.state = {"buy_expression" : "",
                  "sell_expression" : "",
                  "strategy_parameters" : {},
                  "s_count" : 0
                };
    this.tick_value = React.createRef();
    this.handle_expressions = (buy, sell) => {buy == "" ? this.setState({"buy_expression": this.state.buy_expression, "sell_expression":sell.toLowerCase()}) : this.setState({"buy_expression": buy.toLowerCase(), "sell_expression":this.state.sell_expression}); console.log(this.state)};
    this.add_strategy = (strategy_object) => {var temp_strategy_parameters = this.state.strategy_parameters; temp_strategy_parameters["s"+this.state.s_count] = strategy_object; this.setState({"strategy_parameters" : temp_strategy_parameters, "s_count":this.state.s_count + 1});}
    this.make_backtest_request = () => {
      console.log(this.tick_value.current.value);
      const request_options = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({'tick': this.tick_value.current.value, 'strategy_expression_buy':this.state.buy_expression, 'strategy_expression_sell':this.state.sell_expression, 'strategies_parameters':this.state.strategy_parameters })
      };
      fetch('https://claudiocama.pythonanywhere.com/finance/backtest', request_options)
        .then(response => response.json())
        .then(data => console.log(data));
    }
  }

  render() {
    return (
      <React.Fragment>
        <Container style={{ marginTop: "3%", marginBottom: "5%"}}>
          <Row>
            <Col>
              <Form>
                <Form.Group>
                  <Form.Label>Ticker</Form.Label>
                  <Form.Control ref={this.tick_value} placeholder="AAPL" />
                  <Button onClick={this.make_backtest_request} variant="success" style={{ marginTop: "1%"}}>Backtest</Button>
                </Form.Group>
              </Form>
            </Col>
            <Col /><Col /><Col />
          </Row>
        </Container>
        <Container>
          <Row>
            <Col><StrategyBox type="buy" add_strategy={this.add_strategy} strategy_parameters={this.state.strategy_parameters} handle_expressions={this.handle_expressions} title="Buy Strategy" /></Col>
            <Col><StrategyBox type="sell" add_strategy={this.add_strategy} strategy_parameters={this.state.strategy_parameters} handle_expressions={this.handle_expressions} title="Sell Strategy" /></Col>
          </Row>
        </Container>
      </React.Fragment>
    )
  }
}

export default Strategy;
