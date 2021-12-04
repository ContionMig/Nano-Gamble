import config, requests, time
from Include import websocket


def update_nano():
    while True:
        response = requests.get("https://api.nano.to/price?symbol=NANO&currency=USD")
        obj = response.json()
        config.nano_price = float(obj['price'])
        time.sleep(30)

