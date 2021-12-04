from __init__ import app, db, assets


@app.template_filter('len')
def filter_len(obj):
    return len(obj)


@app.template_filter('title')
def filter_title(content):
    content = str(content)
    content = content.replace("_", " ")
    content = content.title()
    return content


@app.template_filter('die_price')
def filter_dice_price(dice):
    return str(assets["dice"][dice]["price"])


@app.template_filter('color_price')
def filter_color_price(color):
    return str(assets["color"][color]["price"])


@app.template_filter('color_hex')
def filter_color_hex(color):
    return str(assets["color"][color]["hex"])