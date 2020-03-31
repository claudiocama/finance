import React, { Component } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import ChartMontecarlo from './ChartMontecarlo';

class Montecarlo extends Component {
  constructor(props) {
    super(props);
    this.state = {"chart_data":"", "chart":false};
    this.tick_value = React.createRef();
    this.make_montecarlo_request = () => {
      const request_options = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({'tick': this.tick_value.current.value})
      };
      fetch('https://claudiocama.pythonanywhere.com/finance/portfolio_montecarlo', request_options)
        .then((response) => {console.log(response); return response.json()})
        .then((data) => {this.setState({"chart_data":data, "chart":true})});
    }
  }

  renderChart(){
    var ret;
    this.state.chart ? ret=<ChartMontecarlo data={this.state.chart_data }/> : ret="";
    return ret
  }

  render() {
    return (
      <Container style={{ marginTop: "3%", marginBottom: "5%"}}>
      <Row>
        <Col>
          <Form>
            <Form.Group>
              <Form.Label>Tickers separeted by a comma</Form.Label>
              <Form.Control ref={this.tick_value} placeholder="AAPL, GOOG, AMZN" />
              <Button onClick={this.make_montecarlo_request} variant="success" style={{ marginTop: "1%"}}>Simulation</Button>
            </Form.Group>
          </Form>
        </Col>
        </Row>
        <Row>
          {this.renderChart()}
        </Row>
      </Container>
    )
  }
}

export default Montecarlo;
