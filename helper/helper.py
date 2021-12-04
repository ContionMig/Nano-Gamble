import hashlib, random, string, re


def ToSHA256(_str):
    hs = hashlib.sha256(str(_str).encode('utf-8')).hexdigest()
    return hs


def Random(min_num, max_num):
    return random.randint(min_num, max_num)


def random_character(size=6, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))


def format_balance(bal):
    return float('{0:.8f}'.format(bal))


def filter_messages(msg):
    return msg


def remove_symbol(content):
    content = str(content)
    content = re.sub(r'[^\w]', ' ', content)
    return content
