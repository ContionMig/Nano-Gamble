from __init__ import app, socketio
from threading import Thread

from Include import websocket, views, filters
from helper import tasks

if __name__ == "__main__":

    thread = Thread(target=tasks.update_nano, daemon=True).start()

    app.run(use_reloader=False, debug=False)
    socketio.run(app)

