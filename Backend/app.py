import sys
sys.path.append('/home/claudiocama/api/')
from flask import Flask, request
from flask_cors import CORS
from flask import jsonify

# /numberAI
sys.path.append('/home/claudiocama/api/numberAI')
import numberAI_analyze as nai
from keras.models import load_model

# /finance
sys.path.append('/home/claudiocama/api/finance')
from finance import backtest
from strategy import *
from pf_montecarlo import pf_montecarlo
import datetime

app = Flask(__name__)
#CORS(app, resources={r"/*": {"origins": "https://www.claudiocama.net"}})
CORS(app)

@app.route('/')
def hello_world():
    return ''

@app.route('/numberAI/analyze', methods=['POST'])
def analyze():
    model = load_model('/home/claudiocama/api/numberAI/my_model.h5')
    data = request.data
    img = nai.preprocessing(data)
    return nai.nn(img, model)

@app.route('/finance/backtest', methods=['POST'])
def algo_backtest():
    test = backtest()
    #test.setDate(datetime.datetime(2015, 1, 1), datetime.datetime(2019, 12, 31))
    test.setTick(request.json["tick"])
    strategy_expression_buy = request.json["strategy_expression_buy"]
    strategy_expression_sell = request.json["strategy_expression_sell"]
    strategies_parameters = request.json["strategies_parameters"]
    print(strategy_expression_buy, strategy_expression_sell, strategies_parameters)
    test.setStrategy(strategy=Main_Strategy, strategy_expression_buy=strategy_expression_buy, strategy_expression_sell=strategy_expression_sell, strategies_parameters=strategies_parameters)
    test.setDataframe(yahoo=True)
    if 'error' in test.isOK():
        return jsonify(test.isOK())
    ret = {}
    ret["performance"] = test.run()
    ret["x"] = [str(x.date().isoformat()) for x in test.getDataframe()["Adj Close"].index.tolist()]
    ret["y"] = test.getDataframe()["Adj Close"].tolist()
    test.setStrategy(BuyHold_Strategy, "", "", "")
    ret["performance_buyhold"] = test.run()
    return jsonify(ret)

@app.route('/finance/portfolio_montecarlo', methods=['POST'])
def portfolio_montecarlo():
    return str(pf_montecarlo(request.json["tick"]))
