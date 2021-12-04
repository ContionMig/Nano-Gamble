sql_commands = [
    """CREATE TABLE IF NOT EXISTS user_info (
        id text PRIMARY KEY NOT NULL,
        balance real NOT NULL DEFAULT 0,
        username text NOT NULL  DEFAULT 'Guest',
        skin text NOT NULL DEFAULT 'default',
        color text NOT NULL DEFAULT 'default',
        timestamp integer NOT NULL DEFAULT 0
    );""",

    """CREATE TABLE IF NOT EXISTS wallets (
        id text PRIMARY KEY NOT NULL,
        private text NOT NULL DEFAULT 'nil',
        public text NOT NULL  DEFAULT 'nil',
        address text NOT NULL DEFAULT 'nil'
    );""",

    """CREATE TABLE IF NOT EXISTS skins (
        id text NOT NULL,
        skin text NOT NULL DEFAULT 'default'
    );""",

    """CREATE TABLE IF NOT EXISTS colors (
        id text NOT NULL,
        color text NOT NULL DEFAULT 'default'
    );""",

    """CREATE TABLE IF NOT EXISTS dice_history (
        game_num INTEGER PRIMARY KEY AUTOINCREMENT,
        game_id text NOT NULL DEFAULT 'nil',
        id text NOT NULL,
        bet real NOT NULL DEFAULT 0.0,
        outcome real NOT NULL DEFAULT 0.0,
        user_roll integer NOT NULL DEFAULT 0,
        bot_roll integer NOT NULL  DEFAULT 0,
        side integer NOT NULL  DEFAULT 0,
        won integer NOT NULL  DEFAULT 0,
        timestamp integer NOT NULL DEFAULT 0
    );""",

    """CREATE TABLE IF NOT EXISTS chat_history (
        chat_num INTEGER PRIMARY KEY AUTOINCREMENT,
        id text NOT NULL,
        username text NOT NULL,
        image text NOT NULL DEFAULT 'default',
        color text NOT NULL DEFAULT 'default',
        message text NOT NULL DEFAULT '-nil-',
        timestamp integer NOT NULL DEFAULT 0
    );""",
]