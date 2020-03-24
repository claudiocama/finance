# Trading library
import backtrader as bt
import backtrader.analyzers as btanalyzers

#Strategy parser
from plyplus import Grammar, STransformer
import operator as op

# Data library
import pandas as pd
import numpy as np
from pandas_datareader import data


class backtest():
    def __init__(self):
        self.cash = 100000.0
        self.commission = 0.0000
        self.percentSizer = 95
        self.strategy = None
        self.strategy_expression_buy = None
        self.strategy_expression_sell = None
        self.strategy_parameters_buy = None
        self.df = None

    def setDate(self, start, end):
        self.start = start
        self.end = end

    def getDate(self):
        return self.start, self.end

    def setTick(self, tick):
        self.tick = tick

    def getTick(self):
        return self.tick

    def setDataframe(self, csv_path="", yahoo=False):
        if yahoo:
            if self.tick:
                #self.df = data.get_data_yahoo(self.tick, self.start, self.end)
                try:
                    self.df = data.get_data_yahoo(self.tick)
                except:
                    self.df = None
            else:
                print("Remember to set start, end and tick!")
        else:
            if csv_path:
                self.df = pd.read_csv(csv_path)
                print("Dataframe added")
            else:
                print("Insert a path for csv file")

    def getDataframe(self):
        return self.df

    def preprocessing(self):
        k = self.df['Adj Close'] / self.df['Close']
        self.df['Adj Open'] = k * self.df['Open']
        self.df['Adj High'] = k * self.df['High']
        self.df['Adj Low'] = k * self.df['Low']

    def setStrategy(self, strategy, strategy_expression_buy, strategy_expression_sell, strategies_parameters):
        self.strategy = strategy
        self.strategy_expression_buy = strategy_expression_buy
        self.strategy_expression_sell = strategy_expression_sell
        self.strategies_parameters = strategies_parameters

    def isOK(self):
        if self.df is None:
            return {'error': 'Insert a valid tick'}
        if self.strategy is None:
            return {'error': 'Insert a valid strategy'}
        return {}

    class PandasData(bt.feeds.PandasData):
        lines = ('Adj Close','Adj Open','Adj High','Adj Low')
        params = (
            ('datetime', None),
            ('open', 'Adj Open'),
            ('high', 'Adj High'),
            ('low', 'Adj Low'),
            ('close', 'Adj Close'),
            ('volume', 'Volume'),
            ('openinterest', None),
            ('Adj Close', -1),
            ('Adj Open', -1),
            ('Adj High', -1),
            ('Adj Low', -1),
        )

    class date_trades_lists(bt.Analyzer):
        def get_analysis(self):
            return [self.buy, self.buy_price, self.sell, self.sell_price]

        def __init__(self):
            self.buy = []
            self.buy_price = []
            self.sell = []
            self.sell_price = []

        def notify_order(self, order):
            if order.status in [order.Completed]:
                if order.isbuy():
                    self.buy.append(self.datas[0].datetime.date(0).isoformat())
                    self.buy_price.append(order.executed.price)
                else:
                    self.sell.append(self.datas[0].datetime.date(0).isoformat())
                    self.sell_price.append(order.executed.price)


    def run(self):
        self.preprocessing()

        cerebro = bt.Cerebro()
        cerebro.addstrategy(strategy=self.strategy, strategy_expression_buy=self.strategy_expression_buy, strategy_expression_sell=self.strategy_expression_sell, strategies_parameters=self.strategies_parameters)

        data = self.PandasData(dataname=self.df)
        cerebro.adddata(data)

        cerebro.addanalyzer(btanalyzers.TradeAnalyzer, _name='TA')
        cerebro.addanalyzer(btanalyzers.DrawDown, _name='Max_DD')
        cerebro.addanalyzer(btanalyzers.AnnualReturn, _name='Annual_Return')
        cerebro.addanalyzer(btanalyzers.SharpeRatio, _name='Sharpe_Ratio')
        cerebro.addanalyzer(btanalyzers.SQN, _name='SQN')
        cerebro.addanalyzer(self.date_trades_lists, _name='date_trades_lists')

        cerebro.broker.setcash(self.cash)
        cerebro.addsizer(bt.sizers.PercentSizer, percents=self.percentSizer)
        cerebro.broker.setcommission(commission=self.commission)

        risultati = cerebro.run()
        ris = risultati [0]

        capitale_iniziale = self.cash
        trades_list = ris.analyzers.date_trades_lists.get_analysis()
        tr = ris.analyzers.TA.get_analysis()
        AR = 1
        for key, value in ris.analyzers.Annual_Return.get_analysis().items():
                AR *= (1+value)
        if "BuyHold" in self.strategy.__name__:
            ret = {
                    'starting_value' : self.cash,
                    'ending_value' : cerebro.broker.getvalue(),
                    'net_profit' : round(cerebro.broker.getvalue()-capitale_iniziale),
                    'total_return' : round((cerebro.broker.getvalue()-capitale_iniziale)/capitale_iniziale*100,2),
                    'annualized_return' : round((AR**(1/len(ris.analyzers.Annual_Return.get_analysis().items()))-1)*100, 2),
                    'sharpe_ratio' : ris.analyzers.Sharpe_Ratio.get_analysis() ['sharperatio']
                }
        elif tr['total']['total']: # >= 1 trade
            ret = {
                    'starting_value' : self.cash,
                    'ending_value' : cerebro.broker.getvalue(),
                    'gross_profit' : round(tr['won']['pnl']['total']),
                    'gross_loss' : round(tr['lost']['pnl']['total']),
                    'net_profit' : round(cerebro.broker.getvalue()-capitale_iniziale),
                    'max_drawdown_perc' : round(ris.analyzers.Max_DD .get_analysis()['max']['drawdown'],2),
                    'max_drawdown' : round(ris.analyzers.Max_DD .get_analysis()['max']['moneydown']),
                    'total_return' : round((cerebro.broker.getvalue()-capitale_iniziale)/capitale_iniziale*100,2),
                    'annualized_return' : round((AR**(1/len(ris.analyzers.Annual_Return.get_analysis().items()))-1)*100, 2),
                    'trades_numbers' : tr['total']['total'],
                    'winning_trades' : tr['won']['total']/tr['total'] ['total']*100,
                    'losing_trades' : tr['lost']['total']/tr['total'] ['total']*100,
                    'winning_trades_avg' : tr['won']['pnl']['average'],
                    'losing_trades_avg' : tr['lost']['pnl']['average'],
                    'winning_trades_max' : tr['won']['pnl']['max'],
                    'losing_trades_max' : tr['lost']['pnl']['max'],
                    'sharpe_ratio' : ris.analyzers.Sharpe_Ratio.get_analysis() ['sharperatio'],
                    'sqn' : ris.analyzers.SQN.get_analysis()['sqn'],
                    'date_buy_trades' : trades_list[0],
                    'price_buy_trades' : trades_list[1],
                    'date_sell_trades' : trades_list[2],
                    'price_sell_trades' : trades_list[3]
                }
        else:
            ret = {
                    'trades_numbers' : 0
                }

        return ret
