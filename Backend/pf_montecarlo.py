import numpy as np
import pandas as pd
from pandas_datareader import data

def pf_montecarlo(tick):
    tick = tick.replace(" ", "")
    tick = tick.split(",")
    list_df = []
    for t in tick:
        df = data.get_data_yahoo(t)
        df.dropna()
        list_df.append(df)

    for df in list_df:
        df["Rit_Nor"] = df["Adj Close"]/df.iloc[0]["Adj Close"]
        df["Diff_Close"] = df["Adj Close"].diff()
    df_rit = pd.concat([df["Rit_Nor"]-1 for df in list_df], axis=1)
    df_diff = pd.concat([df["Diff_Close"] for df in list_df], axis=1)

    def ret_std(portfolio):
        total_return = round((df_rit.iloc[-1] * portfolio).sum(), 3)
        total_std = round((df_rit.std() * portfolio).sum(), 3)
        SR = round(((np.sqrt(252) * df_diff.mean()/df_diff.std()) * portfolio).sum(), 3)
        return [total_return, total_std, SR]

    portfolio_pesi = []
    rendimenti = []
    rischi = []
    SR = []
    for i in range (2500):
        pesi_temp = np.array(np.random.random(len(tick)))
        pesi = pesi_temp/np.sum(pesi_temp)
        portfolio = ret_std(pesi)
        pesi_str = ""
        for t in range(len(tick)):
            pesi_str += "-"+tick[t]+":"+str(pesi.tolist()[t])[:5]+"-"
        portfolio_pesi.append(pesi_str)
        rendimenti.append(portfolio[0])
        rischi.append(portfolio[1])
        SR.append(portfolio[2])
    return {"portfolio_weights": portfolio_pesi, "returns": rendimenti, "risks": rischi, "SR": SR}
