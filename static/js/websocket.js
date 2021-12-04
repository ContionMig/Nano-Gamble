var socket = io();
var balance = 0;
var nano_price = 0;

var min_bet = 0;
var max_bet = 0;

var max_deci = 8;
var total_users = 0;

var dice_payoff = 0.0
var die_skins = ['default', 'red_corner']

var token = 0

socket.on('connect', async function() {
    socket.emit('message');
});

socket.on('disconnect', function() {
    location.reload();
});

socket.on('data', function(msg) {
    min_bet = msg.min_bet;
    max_bet = msg.max_bet;
    die_skins = msg.die_skin;
    max_deci = msg.max_deci;
    dice_payoff = msg.dice_payoff;
    token = msg.token;
});

socket.on('reload', function(msg) {
    location.reload();
});

socket.on('nano_price', function(msg) {
    nano_price = msg.price;
    setTimeout(function() { socket.emit('update_nano', {token: token});}, 15000)
});

socket.on('users', function(msg) {
    total_users = msg.user_count;
});

var update_data = setInterval(function() {
    if (!nano_price) {
        socket.emit('update_nano', {token: token});
    }
    else if (!min_bet || !max_bet || !dice_payoff || !balance || !token) {
       socket.emit('message');
    }
    else {
        clearInterval(update_data);
    }
}, 3000)
