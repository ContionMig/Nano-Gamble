import sqlite3, traceback, sys, config

from sqlite3 import Error
from helper import sql_tables


class database:
    def __init__(self, database_name=config.database):
        self.__conn = None
        try:
            self.__conn = sqlite3.connect(database_name, check_same_thread=False)
            print("SQLITE Connection Established! v{v}".format(v=sqlite3.version_info))

            for x in sql_tables.sql_commands:
                self.Execute(x)

        except Error as er:
            print('SQLite error: %s' % (' '.join(er.args)))
            print("Exception class is: ", er.__class__)
            print('SQLite traceback: ')
            exc_type, exc_value, exc_tb = sys.exc_info()
            print(traceback.format_exception(exc_type, exc_value, exc_tb))

    def Connection(self):
        return self.__conn.cursor()

    def CloseConnection(self):
        if self.__conn:
            self.__conn.close()

    def Commit(self):
        self.__conn.commit()

    def Exist(self, table, column, key):
        try:
            c = self.__conn.cursor()
            c.execute(f"SELECT * FROM {table} WHERE {column} = ?", (key,))
            rows = c.fetchall()

            if not rows:
                return False
            else:
                return True
        except Error as er:
            print('SQLite error: %s' % (' '.join(er.args)))
            print("Exception class is: ", er.__class__)
            print('SQLite traceback: ')
            exc_type, exc_value, exc_tb = sys.exc_info()
            print(traceback.format_exception(exc_type, exc_value, exc_tb))

    def RetrieveAll(self, table):
        try:
            sql_statement = """SELECT * FROM {table}""".format(table=table)

            c = self.__conn.cursor()
            c.execute(sql_statement)
            return c.fetchall()
        except Error as er:
            print('SQLite error: %s' % (' '.join(er.args)))
            print("Exception class is: ", er.__class__)
            print('SQLite traceback: ')
            exc_type, exc_value, exc_tb = sys.exc_info()
            print(traceback.format_exception(exc_type, exc_value, exc_tb))

    def Retrieve(self, table, column, key):
        c = self.__conn.cursor()
        cursor = c.execute(f"""SELECT * FROM {table} WHERE {column} = '{key}';""")

        names = list(map(lambda x: x[0], cursor.description))

        return_last = {}
        rows = list(c.fetchall())

        for y in range(len(names)):
            return_last[names[y]] = rows[0][y]

        return return_last

    def Insert(self, table, key, value):
        sql_statement = """INSERT INTO {table}({key}) VALUES('{value}')""".format(table=table, key=key, value=value)

        c = self.__conn.cursor()
        c.execute(sql_statement)

    def Update(self, table, key, value, key_find, colum="id"):
        try:
            sql_statement = """UPDATE {table} SET {key} = '{value}' WHERE {colum} = '{id}';""".format(colum=colum,
                                                                                                      table=table,
                                                                                                      key=key,
                                                                                                      value=value,
                                                                                                      id=key_find)

            c = self.__conn.cursor()
            c.execute(sql_statement)
        except Error as er:
            print('SQLite error: %s' % (' '.join(er.args)))
            print("Exception class is: ", er.__class__)
            print('SQLite traceback: ')
            exc_type, exc_value, exc_tb = sys.exc_info()
            print(traceback.format_exception(exc_type, exc_value, exc_tb))

    def Deduct(self, table, key, value, key_find, colum="id"):
        try:
            sql_statement = """UPDATE {table} SET {key} = {key} - '{value}' WHERE {colum} = '{id}';""".format(
                table=table, key=key,
                value=value,
                id=key_find, colum=colum)

            c = self.__conn.cursor()
            c.execute(sql_statement)
        except Error as er:
            print('SQLite error: %s' % (' '.join(er.args)))
            print("Exception class is: ", er.__class__)
            print('SQLite traceback: ')
            exc_type, exc_value, exc_tb = sys.exc_info()
            print(traceback.format_exception(exc_type, exc_value, exc_tb))

    def Addition(self, table, key, value, key_find, colum="id"):
        try:
            sql_statement = """UPDATE {table} SET {key} = {key} + '{value}' WHERE {colum} = '{id}';""".format(
                table=table, key=key,
                value=value,
                id=key_find, colum=colum)

            c = self.__conn.cursor()
            c.execute(sql_statement)
        except Error as er:
            print('SQLite error: %s' % (' '.join(er.args)))
            print("Exception class is: ", er.__class__)
            print('SQLite traceback: ')
            exc_type, exc_value, exc_tb = sys.exc_info()
            print(traceback.format_exception(exc_type, exc_value, exc_tb))

    def Execute(self, command):
        c = self.__conn.cursor()
        c.execute(command)
        return c.fetchall()

    def GetAllTables(self):
        c = self.__conn.cursor()
        c.execute("SELECT name FROM sqlite_master WHERE type='table';")

        return_tables = []
        tables = c.fetchall()
        for x in tables:
            return_tables.append(x[0])

        return return_tables

    def GetTableColumn(self, table):
        c = self.__conn.cursor()
        c.execute(f"PRAGMA table_info({table});")

        return_tables = []
        tables = c.fetchall()
        for x in tables:
            return_tables.append(x[1])

        return return_tables

    def GetLastFew(self, table, limit=30, id=None, order="timestamp"):
        c = self.Connection()

        if id is None:
            cursor = c.execute(f"SELECT * FROM {table} ORDER BY {order} DESC;")
        else:
            cursor = c.execute(f"SELECT * FROM {table} WHERE id = '{id}' ORDER BY {order} DESC;")

        names = list(map(lambda x: x[0], cursor.description))

        return_last = []
        rows = list(c.fetchall())

        max_items = 0
        for x in range(len(rows)):

            row = {}
            for y in range(len(names)):
                row[names[y]] = rows[x][y]
            return_last.append(row)

            max_items += 1
            if max_items > limit:
                break

        return return_last