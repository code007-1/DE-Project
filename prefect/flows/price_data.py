import pandas as pd
from datetime import datetime

import finnhub
from prefect import flow
from pymongo import MongoClient

from prefect.blocks.system import Secret

# Data
# Stocks List
shares = [
    "AAPL",
    "GOOG",
    "MSFT",
    "CSCO",
    "META",
    "AMZN",
    "EBAY",
    "TSLA",
    "ADBE",
    "NFLX",
    "SBUX",
    "AMD",
    "NVDA",
    "QCOM",
    "INTC",
    "EA",
    "ATVI",
    "TTWO",
    "PYPL",
    "COKE",
    "TXN",
    "XPEV",
    "F",
    "ABNB",
    "AEP",
    "TEAM",
    "HON",
    "WBD",
]


def DateTimeToTimeStamp(dateTime):
    """Converts Date to Time Stamp"""

    return datetime.strptime(str(dateTime), "%Y-%m-%d %H:%M:%S").timestamp().__int__()


def TimeStampToDateTime(timeStamp):
    """Convert Time Stamp to DateTime"""

    return datetime.fromtimestamp(timeStamp)


def TimeStampToDate(timeStamp):
    """Convert Time Stamp to Date"""

    return datetime.fromtimestamp(timeStamp).date()


@flow(log_prints=True)
def Extract_Data(time=None):
    """Extract Current Price Information of Stocks"""

    # Setup Finnhub client
    finnhub_api_key = Secret.load("finnhub-api-key")
    client = finnhub.Client(api_key=finnhub_api_key.get())

    # Create a dataframe to store data
    data = pd.DataFrame(columns=["c", "h", "l", "o", "s", "t", "v", "symbol"])

    # current time
    if time == None:
        time = DateTimeToTimeStamp(datetime.now().isoformat(" ", "seconds"))

    # Extract data of each share
    for share in shares:
        dataDictionary = client.stock_candles(share, "D", time, time)
        dataDictionary["symbol"] = share
        data = pd.concat([data, pd.DataFrame(dataDictionary)], ignore_index=True)

    # change column names
    data.columns = [
        "close",
        "high",
        "low",
        "open",
        "status",
        "date",
        "volume",
        "symbol",
    ]

    return data


@flow(log_prints=True)
def Transform_Data(data):
    """Apply some simple Transformations"""

    data["date"] = data["date"].apply(TimeStampToDateTime)
    data = data.astype({"volume": int})
    data = data.drop("status", axis=1)

    data = data.reindex(
        columns=["date", "close", "volume", "open", "high", "low", "symbol"]
    )

    return data


@flow(log_prints=True)
def Load_Real_Time_Data(data):
    """Loads Data to Mongodb Database"""

    # Setup Mongodb Connection
    mongodb_username = Secret.load("mongodb-username")
    mongodb_password = Secret.load("mongodb-password")
    url = f"mongodb+srv://{mongodb_username.get()}:{mongodb_password.get()}@clusternex.c1ok7xn.mongodb.net/Stocks_Data"
    client = MongoClient(url)

    # Select Database
    dataBaseObject = client["Stocks_Data"]["Real_Time_Data"]

    # insert data in database
    data = data.to_dict("records")

    # updates real time data in database
    for d in data:
        dataBaseObject.update_one(
            filter={"symbol": d["symbol"]}, update={"$set": d}, upsert=True
        )

    client.close()


@flow(log_prints=True)
def Load_Day_End_Data(data):
    """Loads Data to Mongodb Database"""

    # Setup Mongodb Connection
    mongodb_username = Secret.load("mongodb-username")
    mongodb_password = Secret.load("mongodb-password")
    url = f"mongodb+srv://{mongodb_username.get()}:{mongodb_password.get()}@clusternex.c1ok7xn.mongodb.net/Stocks_Data"
    client = MongoClient(url)

    # Select Database
    dataBaseObject = client["Stocks_Data"]["Real_Time_Data"]

    symbols = data["symbol"]
    data = data.drop("symbol", axis=1)
    data = data.to_dict("records")

    # insert day end data in database
    for s, d in zip(symbols, data):
        # Select collection
        dataBaseObject = client["Stocks_Data"][s]
        dataBaseObject.insert_one(d)

    client.close()


@flow(log_prints=True)
def Real_Time_Data_Process():
    print("Started Real Time Extraction...")
    print("Started Extraction...")
    data = Extract_Data()
    print("Completed Extraction...")
    print("Started Transformation...")
    data = Transform_Data(data)
    print("Completed Transformation...")
    print("Started Loading...")
    Load_Real_Time_Data(data)
    print("Completed Loading...")


@flow(log_prints=True)
def Day_End_Data_Process():
    print("Started Day End Time Extraction...")
    print("Started Extraction...")
    data = Extract_Data()
    print("Completed Extraction...")
    print("Started Transformation...")
    data = Transform_Data(data)
    print("Completed Transformation...")
    print("Started Loading...")
    Load_Day_End_Data(data)
    print("Completed Loading...")


if __name__ == "__main__":
    # Real_Time_Data_Process()
    # Day_End_Data_Process()
    print("schedule it don't run it mannually")

# 09:30 - 10:00 - 30-59/1 16 * * 1-5
# 07:00 - 01:00 - 0/1 7-13 * * 1-5

# 10:00 - 04:00 - 0/1 10-15 * * 1-5
# 01:00 - 01:30 - 0-29/1 13 * * 1-5

# 0-29/1 16 * * 1-5
