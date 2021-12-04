from __init__ import app, db, socketio, assets

from flask import render_template, request, session, request
from helper import helper

from classes.user import UserData

import time, config

connected_clients = {}


def filter_connection(data=None, userid=None):

    if userid is not None:
        if userid not in connected_clients:
            return False

        if connected_clients[userid] > 1:
            return False

    if data is not None:
        if "token" not in data:
            return False

        if str(data["token"]) != str(userid):
            return False

    return True


@socketio.on("connect")
def connect():
    userid = UserData(request.remote_addr, request.user_agent.string).get_id()

    if userid not in connected_clients:
        connected_clients[userid] = 0

    connected_clients[userid] += 1

    config.total_clients += 1
    socketio.emit("users", {"user_count": config.total_clients}, broadcast=True)


@socketio.on("disconnect")
def disconnect():
    userid = UserData(request.remote_addr, request.user_agent.string).get_id()

    if userid not in connected_clients:
        connected_clients[userid] = 1

    connected_clients[userid] -= 1

    config.total_clients -= 1
    socketio.emit("users", {"user_count": config.total_clients}, broadcast=True)


@socketio.on('message')
def handle_connect():
    user = UserData(request.remote_addr, request.user_agent.string)

    if not filter_connection(userid=user.get_id()):
        return

    socketio.emit("data",
                  {
                      'min_bet': float(config.min_bet),
                      'max_bet': float(config.max_bet),
                      'die_skin': list(assets["dice"].keys()),
                      'max_deci': config.max_decimal,
                      'owned_dice': user.skin.get_skins(),
                      'dice_payoff': config.dice_payoff,
                      'token': str(user.get_id())
                  }, json=True)

    socketio.emit("balance_update", {'balance': helper.format_balance(user.get_balance())}, json=True)
    socketio.emit("nano_price", {'price': helper.format_balance(config.nano_price)}, json=True)


@socketio.on('faucet_request')
def handle_faucet(data):
    user = UserData(request.remote_addr, request.user_agent.string)

    if not filter_connection(data, user.get_id()):
        return

    if user.get_balance() >= config.min_bet:
        return socketio.emit("message",
                             {'msg': f"Your balance is higher than {str(config.faucet_amount)}!", 'passed': False},
                             json=True)

    if time.time() - user.get_timestamp() > config.faucet_cooldown * 60:

        user.add_faucet()
        user.set_timestamp()

        socketio.emit("facuvet_cooldown", {'timer': config.faucet_cooldown}, json=True)
        socketio.emit("balance_update", {'balance': helper.format_balance(user.get_balance())}, json=True)
        socketio.emit("nano_price", {'price': helper.format_balance(config.nano_price)}, json=True)
        socketio.emit("message",
                      {
                          'msg': f"You have received {config.faucet_amount} NANO",
                          'passed': True
                      }, json=True)

    else:
        socketio.emit("facuvet_cooldown", {'timer': abs((time.time() - user.get_timestamp()) / 60)}, json=True)
        socketio.emit("message", {'msg': "You are still on cooldown!", 'passed': False}, json=True)


@socketio.on('play_dice')
def handle_dice(data):
    user = UserData(request.remote_addr, request.user_agent.string)

    if not filter_connection(data, user.get_id()):
        return

    user_roll = helper.Random(1, 6)
    bot_roll = helper.Random(1, 6)

    bet_amount = float(data["bet"])
    side = int(data["side"])

    if side == 0:
        won = user_roll < bot_roll
    else:
        won = user_roll > bot_roll

    if bet_amount > user.get_balance():
        return socketio.emit("message", {'msg': "You cannot bet more than you have!", 'passed': False}, json=True)

    if bet_amount <= 0:
        return socketio.emit("message", {'msg': "You cannot bet more than you have!", 'passed': False}, json=True)

    if bet_amount > config.max_bet:
        return socketio.emit("message",
                             {'msg': f"You cannot bet more than {str(config.max_bet)} NANO!", 'passed': False},
                             json=True)

    if bet_amount < config.min_bet:
        return socketio.emit("message",
                             {'msg': f"You cannot bet less than {str(config.min_bet)} NANO!", 'passed': False},
                             json=True)

    if won:
        won_amount = user.get_balance() + (bet_amount * config.dice_payoff) - bet_amount
        if won_amount < 0:
            won_amount = 0

        user.set_balance(won_amount)
        diff_amount = bet_amount * config.dice_payoff - bet_amount
    else:
        lost_amount = user.get_balance() - bet_amount
        if lost_amount < 0:
            lost_amount = 0

        user.set_balance(lost_amount)
        diff_amount = -bet_amount

    game_id = user.dice.add_game_history(user_roll, bot_roll, bet_amount, diff_amount, won, side)

    socketio.emit("dice_history",
                  {
                      'won': won,
                      'amount': helper.format_balance(diff_amount),
                      'game_id': game_id,
                      'time': time.time(),
                      'past': False
                  }, json=True, broadcast=True)

    socketio.emit("dice_results",
                  {
                      'user': user_roll,
                      'bot': bot_roll,
                      'won': won,
                      'amount': helper.format_balance(diff_amount),
                      'balance': helper.format_balance(user.get_balance()),
                      'game_id': game_id,
                      'time': time.time(),
                      'passed': True
                  }, json=True)

    db.Commit()


@socketio.on('buy_dice')
def handle_buy_dice(data):
    user = UserData(request.remote_addr, request.user_agent.string)

    if not filter_connection(data, user.get_id()):
        return

    dice_price = assets["dice"][data["dice"]]["price"]

    if user.get_balance() < dice_price:
        return socketio.emit("message",
                             {'msg': f"You can't afford that dice!", 'passed': False}, json=True)

    user.set_balance(user.get_balance() - dice_price)
    user.skin.add_skin(data["dice"])

    socketio.emit("reload", json=True)
    db.Commit()


@socketio.on('buy_color')
def handle_buy_color(data):
    user = UserData(request.remote_addr, request.user_agent.string)

    if not filter_connection(data, user.get_id()):
        return

    color = data["color"]
    color_price = assets["color"][color]["price"]

    if user.get_balance() < color_price:
        return socketio.emit("message",
                             {'msg': f"You can't afford that color!", 'passed': False}, json=True)

    user.set_balance(user.get_balance() - color_price)
    user.color.add_color(color)

    socketio.emit("reload", json=True)
    db.Commit()


@socketio.on('get_balance')
def handle_balance(data):
    user = UserData(request.remote_addr, request.user_agent.string)

    if not filter_connection(data, user.get_id()):
        return

    socketio.emit("balance_update", {'balance': helper.format_balance(user.get_balance())}, json=True)


@socketio.on('send_message')
def handle_noti_message(data):
    user = UserData(request.remote_addr, request.user_agent.string)

    if not filter_connection(data, user.get_id()):
        return

    message = data["msg"]

    if len(message) < 2:
        return socketio.emit("message",
                             {'msg': f"Please make sure your message is more than 2 characters!", 'passed': False},
                             json=True)

    if len(message) > 250:
        return socketio.emit("message",
                             {'msg': f"Please make sure your message is less than 250 characters!", 'passed': False},
                             json=True)

    message = helper.filter_messages(message)

    user.add_chat(message)
    socketio.emit("new_messages",
                  {
                      'username': user.get_username(),
                      'msg': message,
                      'time': time.time(),
                      'img': user.skin.get_skin(),
                      'color': assets["color"][user.color.get_color()]["hex"],
                      'past': False,
                  }, json=True, broadcast=True)


@socketio.on('request_chat')
def handle_chat_history(data):
    user = UserData(request.remote_addr, request.user_agent.string)
    if not filter_connection(data, user.get_id()):
        return

    chat_history = db.GetLastFew('chat_history')

    for x in range(len(chat_history)):
        socketio.emit("new_messages",
                      {
                          'username': chat_history[x]['username'],
                          'msg': chat_history[x]['message'],
                          'img': chat_history[x]['image'],
                          'time': chat_history[x]['timestamp'],
                          'color': assets["color"][chat_history[x]['color']]["hex"],
                          'past': True,
                      }, json=True)


@socketio.on('request_dice_history')
def handle_dice_history(data):
    user = UserData(request.remote_addr, request.user_agent.string)
    if not filter_connection(data, user.get_id()):
        return

    dice_history = db.GetLastFew('dice_history')
    for x in range(len(dice_history)):
        socketio.emit("dice_history",
                      {
                          'won': dice_history[x]['won'],
                          'amount': helper.format_balance(dice_history[x]['outcome']),
                          'game_id': dice_history[x]['game_id'],
                          'time': dice_history[x]['timestamp'],
                          'past': True
                      }, json=True)


@socketio.on('request_leaderboard')
def handle_leaderboard(data):
    user = UserData(request.remote_addr, request.user_agent.string)
    if not filter_connection(data, user.get_id()):
        return

    dice_history = db.GetLastFew('dice_history', order="outcome", limit=30)

    for x in range(len(dice_history)):
        user = UserData(userid=dice_history[x]['id'])
        socketio.emit("dice_leaderboard",
                      {
                          'won': dice_history[x]['won'],
                          'amount': helper.format_balance(dice_history[x]['outcome']),
                          'game_id': dice_history[x]['game_id'],
                          'username': user.get_username(),
                      }, json=True)


@socketio.on('change_username')
def handle_username(data):
    user = UserData(request.remote_addr, request.user_agent.string)

    if not filter_connection(data, user.get_id()):
        return

    username = helper.remove_symbol(data["username"]).strip()

    if len(username) < 5:
        return socketio.emit("message",
                             {'msg': f"Please make sure your username is more than 5 characters!", 'passed': False},
                             json=True)

    if len(username) > 15:
        return socketio.emit("message",
                             {'msg': f"Please make sure your username is less than 15 characters!", 'passed': False},
                             json=True)

    if db.Exist("user_info", "username", username):
        return socketio.emit("message",
                             {'msg': f"The username is already taken!", 'passed': False},
                             json=True)

    user.set_username(username)
    return socketio.emit("message",
                         {'msg': f"You have successfully changed your username!", 'passed': True},
                         json=True)


@socketio.on('update_nano')
def handle_nano(data):
    user = UserData(request.remote_addr, request.user_agent.string)
    if not filter_connection(data, user.get_id()):
        return

    socketio.emit("nano_price", {'price': helper.format_balance(config.nano_price)}, json=True)


@socketio.on('skin_update')
def handle_skin(data):
    user = UserData(request.remote_addr, request.user_agent.string)

    if not filter_connection(data, user.get_id()):
        return

    skin = data["skin"]

    if skin not in user.skin.get_skins():
        return socketio.emit("message",
                             {'msg': f"You do not own that skin!", 'passed': False},
                             json=True)

    user.skin.set_skin(skin)
    return socketio.emit("message",
                         {'msg': f"You have changed your skin!", 'passed': True},
                         json=True)


@socketio.on('color_update')
def handle_color(data):
    user = UserData(request.remote_addr, request.user_agent.string)

    if not filter_connection(data, user.get_id()):
        return

    color = data["color"]

    if color not in user.color.get_colors():
        return socketio.emit("message",
                             {'msg': f"You do not own that color!", 'passed': False},
                             json=True)

    user.color.set_color(color)
    return socketio.emit("message",
                         {'msg': f"You have changed your color!", 'passed': True},
                         json=True)


@socketio.on('dice_data')
def handle_dice_data(data):
    user = UserData(request.remote_addr, request.user_agent.string)
    if not filter_connection(data, user.get_id()):
        return

    game_id = data["game_id"]
    data = db.Retrieve('dice_history', "game_id", game_id)

    return socketio.emit("dice_round", {
        'won': bool(data['won']),
        'game_id': data['game_id'],
        'image': user.skin.get_skin(),
        'user_roll': data['user_roll'],
        'bot_roll': data['bot_roll'],
        'side': data['side'],
        'bet_amount': helper.format_balance(data['bet']),
        'outcome': helper.format_balance(data['outcome']),
        'game_number': data['game_num'],
        'time': data['timestamp']
    }, json=True)


@socketio.on('refresh_request')
def handle_refresh(data):
    user = UserData(request.remote_addr, request.user_agent.string)
    if not filter_connection(data, user.get_id()):
        return

    socketio.emit("nano_price", {'price': helper.format_balance(config.nano_price)}, json=True)
