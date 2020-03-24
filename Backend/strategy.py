import backtrader as bt
#Strategy parser
from plyplus import Grammar, STransformer
import operator as op

class BuyHold_Strategy(bt.Strategy):
    params = ( ('strategy_expression_buy', None ), ('strategy_expression_sell', None ), ('strategies_parameters', None), )

    def __init__(self):
        self.dataclose = self.datas[0].close

    def next(self):
        if not self.position:
            self.buy()

        if len(self.dataclose) == (self.dataclose.buflen())-1:
            self.close()

class Main_Strategy(bt.Strategy):
    params = ( ('strategy_expression_buy', None ), ('strategy_expression_sell', None ), ('strategies_parameters', None), )

    class Calc(STransformer):
        def __init__(self, indicators, strategies_parameters):
            self.indicators = indicators
            self.strategies_parameters = strategies_parameters
            self.strategies_functions = {
                "CCI_buy_Strategy": self.CCI_buy_Strategy,
                "CCI_sell_Strategy": self.CCI_sell_Strategy,
                "Crossover_SMA_Strategy": self.Crossover_SMA_Strategy
            }
        def CCI_buy_Strategy(self, parameter, indicator):
            if self.indicators[indicator] < parameter["value"]:
                return 1
            else:
                return 0

        def CCI_sell_Strategy(self, parameter, indicator):
            if self.indicators[indicator] > parameter["value"]:
                return 1
            else:
                return 0

        def Crossover_SMA_Strategy(self, parameter, indicator):
            if self.indicators[indicator] > 0:
                return 1
            else:
                return 0

        def _bin_operator(self, atom):
            arg1, operator_symbol, arg2 = atom.tail
            operator_func = { '&': op.and_, '|': op.or_ }[operator_symbol.tail[0]]
            return operator_func(arg1, arg2)

        def _bin_strategy(self, atom):
            s_p = self.strategies_parameters[atom.tail[0]]
            return self.strategies_functions[s_p["name"]](s_p["parameter"], int(atom.tail[0].replace("s","")))

        strategy = _bin_strategy
        atomic = _bin_operator

    def __init__(self):
        self.dataclose = self.datas[0].close
        self.indicators = []
        self.strategy_expression_buy = self.params.strategy_expression_buy
        self.strategy_expression_sell = self.params.strategy_expression_sell
        self.strategies_parameters = self.params.strategies_parameters
        for s, p in self.strategies_parameters.items():
            if p["name"] == "CCI_buy_Strategy":
                self.indicators.append(bt.indicators.CommodityChannelIndex())
            elif p["name"] == "CCI_sell_Strategy":
                self.indicators.append(bt.indicators.CommodityChannelIndex())
            elif p["name"] == "Crossover_SMA_Strategy":
                sma_fast, sma_slow = bt.ind.SMA(period=p["parameter"]["fast"]), bt.ind.SMA(period=p["parameter"]["slow"])
                self.indicators.append(bt.indicators.CrossOver(sma_fast, sma_slow))
        self.strategy_parser = Grammar("""
                                        start: exp ;
                                        @exp : strategy | atomic ;
                                        atomic: '\(' exp op exp '\)' | exp op exp ;
                                        strategy: 's\d+' ;
                                        op: '\&|\|' ;
                                        SPACES: '[ ]+' (%ignore) ;
                                    """)
        self.strategy_expression_buy = self.strategy_parser.parse(self.strategy_expression_buy)
        self.calc_buy = self.Calc(self.indicators, self.strategies_parameters)
        self.strategy_expression_sell = self.strategy_parser.parse(self.strategy_expression_sell)
        self.calc_sell = self.Calc(self.indicators, self.strategies_parameters)

    def next(self):
        buysig = self.calc_buy.transform(self.strategy_expression_buy).tail[0]
        sellsig = self.calc_sell.transform(self.strategy_expression_sell).tail[0]
        if not self.position:
            if buysig:
                self.buy()
        else:
            if sellsig:
                self.close()

        if len(self.dataclose) == (self.dataclose.buflen())-1:
            self.close()
