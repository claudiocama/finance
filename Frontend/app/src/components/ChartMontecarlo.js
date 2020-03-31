import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Plotly from "plotly.js-basic-dist";
import createPlotlyComponent from "react-plotly.js/factory";
const Plot = createPlotlyComponent(Plotly);


class ChartMontecarlo extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  };

  render(){
    return (
      <Container>
        <Row>
            <Col>
            <Plot
              data={[
                {
                  x: this.props.data.risks,
                  y: this.props.data.returns,
                  text: this.props.data.portfolio_weights,
                  mode: 'markers', type: 'scatter', marker: {size:5, color: this.props.data.SR, colorscale:'RdBu', showscale:true, colorbar:{title: {text:"Sharpe Ratio", font:{family:"Courier New, monospace"}}}}
                }
              ]}
              layout={ {showlegend: false, autosize: true, title: {text:"Portfolio Simulation", font:{family:"Courier New, monospace"}}, xaxis:{title: {text:"Risks", font:{family:"Courier New, monospace"}}},	yaxis:{title: {text:"Returns", font:{family:"Courier New, monospace"}}} }}
              useResizeHandler="true"
              style={{width: "100%", height: "100%"}}
            />
          </Col>
        </Row>
      </Container>
    )
  }
}

export default ChartMontecarlo;
