from __init__ import db
from helper import helper

import time


class SkinData:
    def __init__(self, userid):
        self.__userid = userid

        exist = db.Exist("skins", "id", self.__userid)
        if not exist:
            self.add_skin("default")

    def get_id(self):
        return self.__userid

    def add_skin(self, skin):
        c = db.Connection()
        c.execute("INSERT INTO skins(id, skin) VALUES(?, ?);", (self.__userid, skin))
        db.Commit()

    def has_skin(self, skin):
        try:

            c = db.Connection()
            c.execute("SELECT skin FROM skins WHERE id = ? AND skin = ?;", (self.__userid, skin))
            skin = c.fetchall()[0][0]

            return True
        except:
            return False

    def get_skins(self):

        owned_skins = db.Execute(f"SELECT skin FROM skins WHERE id='{self.__userid}';")
        _ret = []

        for x in range(len(owned_skins)):
            _ret.append(owned_skins[x][0])

        return _ret

    def get_skin(self):
        try:
            return str(
                db.Execute(f"SELECT skin FROM user_info WHERE id='{self.__userid}';")[0][0])
        except:
            return "default"

    def set_skin(self, skin):
        c = db.Connection()
        c.execute("UPDATE user_info SET skin = ? WHERE id = ?;", (skin, self.__userid))
        db.Commit()
