from flask import Flask

from flask_socketio import SocketIO
from flask_qrcode import QRcode
from flask_minify import minify

from datetime import datetime, timedelta

import nano, config, json

from classes import database

db = database.database()
assets = json.load(open('./assets.json',))
rpc = nano.rpc.Client(config.rpc_url)

app = Flask(__name__)

app.config['SECRET_KEY'] = config.secret_key
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=config.session_life)

QRcode(app)

socketio = SocketIO(app)
minify(app=app, html=True, js=True, cssless=True)