from __init__ import app, db, assets

from flask import render_template, request, session, request

from classes.user import UserData


@app.route('/', methods=['GET'])
def index():

    user = UserData(request.remote_addr, request.user_agent.string)

    all_dice = list(assets["dice"].keys())
    user_dice = user.skin.get_skins()
    not_owned_dice = list([x for x in all_dice if x not in user_dice])

    all_color = list(assets["color"].keys())
    user_color = user.color.get_colors()
    not_owned_color = list([x for x in all_color if x not in user_color])

    return render_template('index.html',
                           user_dice=user_dice,
                           not_owned_dice=not_owned_dice,
                           user_color=user_color,
                           not_owned_color=not_owned_color,
                           wallet=user.wallet.get_address())
