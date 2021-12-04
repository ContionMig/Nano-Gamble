from __init__ import db, rpc


class WalletData:
    def __init__(self, userid):
        self.__userid = userid

        exist = db.Exist("wallets", "id", self.__userid)
        if not exist:
            wallet = rpc.key_create()
            db.Execute(f"""INSERT INTO wallets(id, private, public, address) VALUES('{self.__userid}', '{wallet["private"]}', '{wallet["public"]}', '{wallet["account"]}')""")
            db.Commit()

    def get_id(self):
        return self.__userid

    def get_private(self):
        try:
            return str(
                db.Execute(f"SELECT private FROM wallets WHERE id='{self.__userid}';")[0][0])
        except:
            return "0"

    def get_public(self):
        try:
            return str(
                db.Execute(f"SELECT public FROM wallets WHERE id='{self.__userid}';")[0][0])
        except:
            return "0"

    def get_address(self):
        try:
            return str(
                db.Execute(f"SELECT address FROM wallets WHERE id='{self.__userid}';")[0][0])
        except:
            return "0"