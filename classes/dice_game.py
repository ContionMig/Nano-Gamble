from __init__ import db
from helper import helper

import time


class DiceGameData:
    def __init__(self, userid):
        self.__userid = userid

    def get_id(self):
        return self.__userid

    def add_game_history(self, user_roll, bot_roll, bet_amount, outcome, won, side):
        game_id = helper.random_character(4 * 4)
        db.Execute(
            f"""INSERT INTO dice_history(id, outcome, bet, user_roll, bot_roll, game_id, won, side, timestamp) VALUES('{self.__userid}','{outcome}','{bet_amount}','{user_roll}','{bot_roll}','{game_id}','{int(won)}','{side}',{int(time.time())})""")
        db.Commit()

        return game_id
