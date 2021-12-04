$(document).ready(function() {

    function update_balance(new_bal) {
        var bal = parseFloat(parseFloat(new_bal).toFixed(max_deci));
        const balance_e = document.getElementById("balance");

        var html_bal = "";
        var bal_str = bal.toString()

        if (bal > 0) {
            for (i = 0; i <= bal_str.length; i++) {
                html_bal += "<div class='bal_num'>" + bal_str.charAt(i) + "</div>";
            }

            html_bal += '<svg style="padding-left: 3px;" width="25px" height="50px" viewBox="0 0 314 136" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="Balance_nanoLogo__3m3c2"><title>Group</title><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="nano-logo" transform="translate(0.500000, 0.800000)" fill="#FFFFFF" fill-rule="nonzero"><g id="Group" transform="translate(0.000000, -0.000000)"><path d="M179,67.2 C179,79.6 169,89.6 156.6,89.6 C144.2,89.6 134.2,79.6 134.2,67.2 C134.2,50.4 128.6,44.8 111.8,44.8 C95,44.8 89.5,50.5 89.5,67.2 C89.5,79.6 79.5,89.6 67.1,89.6 C54.7,89.6 44.7,79.6 44.7,67.2 C44.7,54.8 54.7,44.8 67.1,44.8 C83.9,44.8 89.5,39.2 89.5,22.4 C89.5,10 99.5,0 111.9,0 C124.3,0 134.3,10 134.3,22.4 C134.3,39.2 139.9,44.8 156.7,44.8 C168.9,44.9 179,54.9 179,67.2 Z" id="Path"></path><circle id="Oval" cx="22.4" cy="112" r="22.4"></circle><path d="M313.1,22.5 C313.1,34.9 303.1,44.9 290.7,44.9 C273.9,44.9 268.3,50.5 268.3,67.3 C268.3,79.7 258.3,89.7 245.9,89.7 C229.1,89.7 223.5,95.3 223.5,112.1 C223.5,124.5 213.5,134.5 201.1,134.5 C188.7,134.5 178.7,124.5 178.7,112.1 C178.7,99.7 188.7,89.7 201.1,89.7 C217.9,89.7 223.5,84.1 223.5,67.3 C223.5,54.9 233.5,44.9 245.9,44.9 C262.7,44.9 268.3,39.3 268.3,22.5 C268.3,10.1 278.3,0.1 290.7,0.1 C303.1,0.1 313.1,10.2 313.1,22.5 Z" id="Path"></path></g></g></g></svg>'
            html_bal += "<div class='bal_actual bal_round'>≈</div>";
            html_bal += "<div class='bal_actual'>$</div>";

            var bal_usd = parseFloat(bal * nano_price).toFixed(6).toString();
            for (i = 0; i <= bal_usd.length; i++) {
                html_bal += "<div class='bal_actual'>" + bal_usd.charAt(i) + "</div>";
            }
        } else {
            html_bal = '<div class="bal_num">0</div>'
        }

        balance_e.innerHTML = html_bal;
        balance = parseFloat(bal)
    };

    function update_payoff() {
        document.getElementById("payout_multi").innerHTML = 'x' + dice_payoff

        payoff_nano = parseFloat($("#bet_amount").val() * dice_payoff).toFixed(max_deci)
        document.getElementById("payout_nano").innerHTML = payoff_nano + '<svg style="padding-left: 3px;" width="25px" height="60px" viewBox="0 0 314 136" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="Balance_nanoLogo__3m3c2"><title>Group</title><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="nano-logo" transform="translate(0.500000, 0.800000)" fill="#FFFFFF" fill-rule="nonzero"><g id="Group" transform="translate(0.000000, -0.000000)"><path d="M179,67.2 C179,79.6 169,89.6 156.6,89.6 C144.2,89.6 134.2,79.6 134.2,67.2 C134.2,50.4 128.6,44.8 111.8,44.8 C95,44.8 89.5,50.5 89.5,67.2 C89.5,79.6 79.5,89.6 67.1,89.6 C54.7,89.6 44.7,79.6 44.7,67.2 C44.7,54.8 54.7,44.8 67.1,44.8 C83.9,44.8 89.5,39.2 89.5,22.4 C89.5,10 99.5,0 111.9,0 C124.3,0 134.3,10 134.3,22.4 C134.3,39.2 139.9,44.8 156.7,44.8 C168.9,44.9 179,54.9 179,67.2 Z" id="Path"></path><circle id="Oval" cx="22.4" cy="112" r="22.4"></circle><path d="M313.1,22.5 C313.1,34.9 303.1,44.9 290.7,44.9 C273.9,44.9 268.3,50.5 268.3,67.3 C268.3,79.7 258.3,89.7 245.9,89.7 C229.1,89.7 223.5,95.3 223.5,112.1 C223.5,124.5 213.5,134.5 201.1,134.5 C188.7,134.5 178.7,124.5 178.7,112.1 C178.7,99.7 188.7,89.7 201.1,89.7 C217.9,89.7 223.5,84.1 223.5,67.3 C223.5,54.9 233.5,44.9 245.9,44.9 C262.7,44.9 268.3,39.3 268.3,22.5 C268.3,10.1 278.3,0.1 290.7,0.1 C303.1,0.1 313.1,10.2 313.1,22.5 Z" id="Path"></path></g></g></g></svg>';
    }

    $('#play_higherlower').on('click ', function() {
        document.getElementById("higher_lower_game").style.display = "block";
        document.getElementById("payout_stack_game").style.display = "none";
    });

    $('#play_payoutstack').on('click ', function() {
        document.getElementById("higher_lower_game").style.display = "none";
        document.getElementById("payout_stack_game").style.display = "block";
    });

    $('#faucet_request').on('click ', function() {
        socket.emit('faucet_request', {token: token});
    });

    $('#refresh_request').on('click ', function() {
        socket.emit('refresh_request', {token: token});
    });

    $('#withdraw_request').on('click ', function() {
        socket.emit('withdraw_request', {token: token});
    });

    $('#half').on('click ', function() {
        var curr_bet = document.getElementById("bet_amount").value;
        curr_bet = parseFloat(curr_bet).toFixed(max_deci);

        curr_bet = curr_bet / 2;
        if (curr_bet < min_bet) {
            curr_bet = min_bet;
        }

        document.getElementById("bet_amount").value = curr_bet;
    });

    $('#double').on('click ', function() {
        var curr_bet = document.getElementById("bet_amount").value;
        curr_bet = parseFloat(curr_bet).toFixed(max_deci);

        curr_bet = curr_bet * 2;
        if (curr_bet > max_bet) {
            curr_bet = max_bet;
        }

        document.getElementById("bet_amount").value = curr_bet
        update_payoff()
    });

    $('#max').on('click ', function() {
        curr_bet = parseFloat(balance)
        if (curr_bet > 10) {
            curr_bet = 10;
        }

        document.getElementById("bet_amount").value = parseFloat(curr_bet);
        update_payoff()
    });

    $('#min').on('click ', function() {
        document.getElementById("bet_amount").value = parseFloat(min_bet);
        update_payoff()
    });

    $( "#bet_amount" ).on("input", function(){
        update_payoff()
    });

    $('#copy').on('click ', function() {
        success("You have copied the wallet address!")
        copy_clipboard( document.getElementById("wallet_address").innerHTML)
    });

    socket.on('facuvet_cooldown', function(msg) {
        countdown("faucet_timer", msg.timer, 0);
    });

    socket.on('balance_update', function(msg) {
        update_balance(msg.balance);
    });

    socket.on('nano_price', function(msg) {
        nano_price = msg.price;

        display = parseFloat(nano_price).toFixed(6).toString();

        var x = document.getElementsByClassName("price_tag");
        for (var i = 0; i < x.length; i++) {
          x[i].innerHTML = '1 NANO = $' + display;
        }

    });

    var update_time = setInterval(function() {

        $(".history_time").each(function() {
            $(this).html(timeDifference($(this).attr('original')));
        });

    }, 15000);

    var update_side_text = setInterval(function() {

        var x = document.getElementsByClassName("curr_online");
        for (var i = 0; i < x.length; i++) {
          x[i].innerHTML = '<span style="color: green;">' + total_users + '</span> Online Users';
        }

    }, 5000)

    setTimeout(function() { socket.emit('get_balance', {token: token}); }, 1500)
    setTimeout(function() { update_payoff(); }, 2500)

    document.documentElement.scrollTop = 0;
    setTimeout(function() {  document.documentElement.scrollTop = 0; }, 1500)
})
