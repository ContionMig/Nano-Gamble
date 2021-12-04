from __init__ import db
from helper import helper

import time, config

from classes.wallet import WalletData
from classes.dice_game import DiceGameData
from classes.skin import SkinData
from classes.color import ColorData

class UserData:
    def __init__(self, ip_address=None, user_agent=None, userid=None):

        if userid is None:
            self.__userid = str(helper.ToSHA256(f"{ip_address}{user_agent}")).strip()
        else:
            self.__userid = str(userid)

        exist = db.Exist("user_info", "id", self.__userid)
        if not exist:
            c = db.Connection()
            c.execute("INSERT INTO user_info(id) VALUES(?);", (self.__userid,))
            db.Commit()

        self.wallet = WalletData(self.__userid)
        self.dice = DiceGameData(self.__userid)
        self.skin = SkinData(self.__userid)
        self.color = ColorData(self.__userid)

    def get_id(self):
        return self.__userid

    def get_balance(self):
        try:
            return float(
                db.Execute(f"SELECT balance FROM user_info WHERE id='{self.__userid}';")[0][0])
        except:
            return 0

    def set_balance(self, amount):
        amount = float(amount)
        if amount < 0:
            amount = 0

        amount = float(helper.format_balance(amount))

        c = db.Connection()
        c.execute("UPDATE user_info SET balance = ? WHERE id = ?;", (amount, self.__userid))

    def get_username(self):
        try:
            return str(
                db.Execute(f"SELECT username FROM user_info WHERE id='{self.__userid}';")[0][0])
        except:
            return "guest"

    def set_username(self, username):
        c = db.Connection()
        c.execute("UPDATE user_info SET username = ? WHERE id = ?;", (str(username), self.__userid))

    def get_timestamp(self):
        try:
            return int(
                db.Execute(f"SELECT timestamp FROM user_info WHERE id='{self.__userid}';")[0][0])
        except:
            return 0

    def set_timestamp(self):
        c = db.Connection()
        c.execute("UPDATE user_info SET timestamp = ? WHERE id = ?;", (int(time.time()), self.__userid))
        db.Commit()

    def add_faucet(self):
        self.set_balance(self.get_balance() + config.faucet_amount)
        return self.get_balance()

    def add_chat(self, message):
        c = db.Connection()
        c.execute("INSERT INTO chat_history(id, username, message, timestamp, image, color) VALUES(?, ?, ?, ?, ?, ?)",
                  (self.__userid, self.get_username(), message, time.time(), self.skin.get_skin(), self.color.get_color()))
