from __init__ import db
from helper import helper

import time


class ColorData:
    def __init__(self, userid):
        self.__userid = userid

        exist = db.Exist("colors", "id", self.__userid)
        if not exist:
            self.add_color("default")

    def get_id(self):
        return self.__userid

    def add_color(self, color):
        c = db.Connection()
        c.execute("INSERT INTO colors(id, color) VALUES(?, ?);", (self.__userid, color))
        db.Commit()

    def has_color(self, color):
        try:

            c = db.Connection()
            c.execute("SELECT color FROM colors WHERE id = ? AND color = ?;", (self.__userid, color))
            color = c.fetchall()[0][0]

            return True
        except:
            return False

    def get_colors(self):

        owned_colors = db.Execute(f"SELECT color FROM colors WHERE id='{self.__userid}';")
        _ret = []

        for x in range(len(owned_colors)):
            _ret.append(owned_colors[x][0])

        return _ret

    def get_color(self):
        try:
            return str(
                db.Execute(f"SELECT color FROM user_info WHERE id='{self.__userid}';")[0][0])
        except:
            return "default"

    def set_color(self, color):
        c = db.Connection()
        c.execute("UPDATE user_info SET color = ? WHERE id = ?;", (color, self.__userid))
        db.Commit()
