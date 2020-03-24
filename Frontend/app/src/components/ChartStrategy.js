import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Plotly from "plotly.js-basic-dist";
import createPlotlyComponent from "react-plotly.js/factory";
const Plot = createPlotlyComponent(Plotly);


class ChartStrategy extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  };

  render(){
    return (
      <Modal centered show={true} onHide={this.props.hide_chart} dialogClassName="modal-90w" >
        <Modal.Header closeButton>
          <Modal.Title>Add strategy</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Plot
      data={[
        {
          x: this.props.data.x,
          y: this.props.data.y,
          type: 'scatter',
        },
        {
          x: this.props.data.performance.date_buy_trades,
          y: this.props.data.performance.price_buy_trades,
          mode: 'markers', type: 'scatter', marker: {color: 'rgb(0, 255, 0)'}
        },
  {
          x: this.props.data.performance.date_sell_trades,
          y: this.props.data.performance.price_sell_trades,
          mode: 'markers', type: 'scatter', marker: {color: 'rgb(255, 0, 0)'}
        }
      ]}
      layout={ {showlegend: false, autosize: true} }
      useResizeHandler="true"
      style={{width: "100%", height: "100%"}}
    />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.props.hide_chart}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

export default ChartStrategy;
