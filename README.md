# Nano Gamble
[[My Website]](https://mitsuzi.xyz/)

![main_gig](https://github.com/ContionMig/Nano-Gamble/blob/main/screens/2021-12-04%2010-02-17.gif)

# Screenshots
![main](https://github.com/ContionMig/Nano-Gamble/blob/main/screens/main.png)

# Live Features
- Chat System ( Live )
- Recently Games ( Both Local & Other Players )

# Monetizable
There are skins that users can purchase, the administrators can easily add new skins through the `assets.json`. Other than the skins, there are also chat colors that users can purchase. All of this can be set through the `assets.json`. 

# Games
There are currently only one game that is playable however, i have made it so that you can add multiple games without having much of a headache. There is a spot on the top left that allows the players to switch between the games that are on the website

### Higher or Lower
It's a pretty basic game that i coded in, it just involves choosing between higher or lower. Betting against a bot, whichever option the user lands on gives out a payout. Since it's not a 50/50, the payout is slightly higher than something like a coin flip. The dice also get animated when rolling and the user is able to change skins if needed.

# TO-DO
- More Games
- Adding actual withdrawal and deposit

# Modules
```
flask
flask-socketio
flask-qrcode
Flask-Minify
nano-python
```

# Credits
- NanoSquares: https://www.nanosquares.io/ for UI inspiration
- 3D Dice: https://codesandbox.io/s/xjk3xqnprw
