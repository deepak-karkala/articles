# Get tests per million
dfst = pd.read_csv("../data/extracted_data_api/statewise_testing.csv")[["State", "Updated On", "Total Tested"]]
dfst.rename(columns={"State":"state_name", "Total Tested":"tests", "Updated On":"date"}, inplace=True)
dfcc = pd.read_csv("../data/extracted_data_api/code_data/districtwise_case_death_growth_density_withNamesMapped.csv")
dfsp = dfcc.groupby(["state","state_code"]).sum()["population"].reset_index()
dfsp.rename(columns={"state":"state_name"}, inplace=True)
dfst = dfst.set_index("state_name").join(dfsp.set_index("state_name"), how="inner").reset_index()
dfst["date"] = pd.to_datetime(dfst["date"], dayfirst=True).dt.date
### Tests per million population
dfst["testspm"] = dfst["tests"]/dfst["population"] * 1e6
dfst["testspm"] = np.round(dfst["testspm"], 2)
del dfst["tests"], dfst["population"]
"""
dftt = pd.read_csv("../data/extracted_data_api/state_codes.csv")
dftt.rename(columns={"state":"state_name"}, inplace=True)
dfst = dfst.set_index("state_name").join(dftt.set_index("state_name")).reset_index()
"""
dfsc = pd.read_csv("../data/extracted_data_api/statewise_daily_confirmed.csv")
dfsc["date"] = pd.to_datetime(dfsc["date"], dayfirst=True).dt.date
start_date = dfsc["date"][0]
end_date = dfsc["date"][len(dfsc)-1]

dfit = pd.DataFrame()
state_list = dfst["state_name"].unique()

for i in range(len(state_list)):
    state_name = state_list[i]
    dft = dfst[dfst["state_name"]==state_name].copy()
    dft.dropna(subset=["testspm"], inplace=True)
    dft.drop_duplicates(inplace=True, subset=["date"], keep="last")
    state_code = dft["state_code"].unique()[0]
    dfi = pd.DataFrame()
    cdt = start_date
    idx=0
    while cdt<=end_date:
        dfi.at[idx, "date"] = cdt
        cdt += timedelta(days=1)
        idx +=1
    dfi = dfi.set_index("date").join(dft.set_index("date")).reset_index()
    dfi["state_name"] = dfi["state_name"].fillna(state_name)
    dfi["state_code"] = dfi["state_code"].fillna(state_code)
    dfi["testspm"] = dfi["testspm"].fillna(method="ffill")
    dfi["testspm"] = dfi["testspm"].fillna(0)

    dfi["date"] = dfi["date"].apply(lambda x: x.strftime('%Y-%m-%d')+"_testspm")
    del dfi["state_name"], dfi["state_code"]
    dfi.rename(columns={"testspm":state_code}, inplace=True)
    dfi = dfi.transpose()
    new_header = dfi.iloc[0]
    dfi = dfi[1:]
    dfi.columns = new_header
    dfi.reset_index(inplace=True)
    dfi.rename(columns={"index":"state"}, inplace=True)
    
    if i==0:
        dfit = dfi.copy()
    else:
        dfit = dfit.append(dfi) #, sort=True)




## Get growth rate
dfsc = pd.read_csv("../data/extracted_data_api/statewise_daily_confirmed.csv")
del dfsc["TT"], dfsc["Unnamed: 39"]
dfsc["date"] = pd.to_datetime(dfsc["date"]).dt.date
dfsc["date"] = dfsc["date"].apply(lambda x: x.strftime('%Y-%m-%d'))
dfsc = dfsc.set_index("date").cumsum().reset_index()

dfsg = pd.DataFrame()
stidx = 0
for col in dfsc.columns:
    if col not in ["date"]:
        dfss = dfsc[["date", col]].copy()
        dfss
        dfss["prev"] = np.nan
        l = [[0], dfss[col].values[:len(dfss)-1]]
        previous_day_count = [item for sublist in l for item in sublist]
        dfss["prev"] = previous_day_count
        dfss["day_growth"] = (dfss[col] - dfss["prev"])/ dfss["prev"]*100
        dfss["avg_day_growth"] = dfss["day_growth"].rolling(5).mean()
        dfss["avg_day_growth"] = np.round(dfss["avg_day_growth"], 2)
        del dfss[col], dfss["prev"], dfss["day_growth"]
        dfss.rename(columns={"avg_day_growth":col}, inplace=True)
        dfss = dfss.transpose()
        new_header = dfss.iloc[0]
        dfss = dfss[1:]
        dfss.columns = new_header
        dfss.reset_index(inplace=True)
        dfss.rename(columns={"index":"state"}, inplace=True)
        
        if stidx==0:
            dfsg = dfss.copy()
        else:
            dfsg = dfsg.append(dfss)
        stidx+=1