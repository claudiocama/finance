import React, { Component } from 'react';
import { Button, Modal, DropdownButton, Dropdown } from 'react-bootstrap';
import StrategyItem from './StrategyItem';
import CCI_buy from './modal_strategy/CCI_buy'
import CCI_sell from './modal_strategy/CCI_sell'
import Crossover_SMA from './modal_strategy/Crossover_SMA'


class StrategyList extends Component {
  constructor(props) {
    super(props);
    this.state = {
                    "adding_component" : "",
                    "buy_strategies": ["CCI_buy", "Crossover_SMA"],
                    "sell_strategies": ["CCI_sell"]
                 };
    this.open_adding_strategy = (evt) => {this.setState({"adding_component":evt})}
  };

  render_list() {
    var list = [];
    var strategy_parameters = Object.keys(this.props.strategy_parameters)
                              .filter(key => {if (this.props.strategy_parameters[key].type == this.props.type) return key})
                              .reduce((obj, key) => {
                                obj[key] = this.props.strategy_parameters[key];
                                return obj;
                              }, {}); //filter strategy to print by type
    for (const strategy in strategy_parameters){
      list.push(<StrategyItem name={strategy} parameters={strategy_parameters[strategy]} />);
    }
    return list
  };

  render_adding_strategy(){
    switch(this.state.adding_component) {
      case "CCI_buy":
        return <CCI_buy close_adding_strategy={this.open_adding_strategy} add_strategy={this.props.add_strategy}/>
      case "CCI_sell":
        return <CCI_sell close_adding_strategy={this.open_adding_strategy} add_strategy={this.props.add_strategy}/>
      case "Crossover_SMA":
        return <Crossover_SMA close_adding_strategy={this.open_adding_strategy} add_strategy={this.props.add_strategy}/>
      default:
        return ""
    }
  }

  render() {
    return (
      <React.Fragment>
        {this.render_list()}
        <DropdownButton title="+" onSelect={(evt) => this.open_adding_strategy(evt)}>
          {this.props.type=="buy" ? this.state.buy_strategies.map(strategy => (<Dropdown.Item eventKey={strategy}>{strategy.replace("_"," ")}</Dropdown.Item>)) : this.state.sell_strategies.map(strategy => (<Dropdown.Item eventKey={strategy}>{strategy.replace("_"," ")}</Dropdown.Item>))}
        </DropdownButton>
        {this.render_adding_strategy()}
      </React.Fragment>
    )
  }
}

export default StrategyList;
