$(document).ready(function() {
    var history = [];

    var rolling = false;

    var dice = $('#dice__cube');
    var dice_bot = $('#dice__cube_bot');

    var animationSpeed = dice.css('transition-duration').split(',')[0].replace(/[^-\d\.]/g, '') * 1000;

    function remove_popup() {
        $("#dice_data_popup").remove();
    }

    function user_skin(index, auto) {

        var skins = die_skins

        $('.user_front').attr('style', "background-image: url('/static/assets/images/die/" + skins[index] + "/dice-1.png');");
        $('.user_back').attr('style', "background-image: url('/static/assets/images/die/" + skins[index] + "/dice-6.png');");
        $('.user_right').attr('style', "background-image: url('/static/assets/images/die/" + skins[index] + "/dice-4.png');");
        $('.user_left').attr('style', "background-image: url('/static/assets/images/die/" + skins[index] + "/dice-3.png');");
        $('.user_top').attr('style', "background-image: url('/static/assets/images/die/" + skins[index] + "/dice-2.png');");
        $('.user_bottom').attr('style', "background-image: url('/static/assets/images/die/" + skins[index] + "/dice-5.png');");

        if (!auto) {
            socket.emit('skin_update', {
                skin: skins[index],
                token: token
            });
        }
    }

    function bot_skin(index) {

        var skins = die_skins

        $('#bot_front').attr('style', "background-image: url('/static/assets/images/die/" + skins[index] + "/dice-1.png');");
        $('#bot_back').attr('style', "background-image: url('/static/assets/images/die/" + skins[index] + "/dice-6.png');");
        $('#bot_right').attr('style', "background-image: url('/static/assets/images/die/" + skins[index] + "/dice-4.png');");
        $('#bot_left').attr('style', "background-image: url('/static/assets/images/die/" + skins[index] + "/dice-3.png');");
        $('#bot_top').attr('style', "background-image: url('/static/assets/images/die/" + skins[index] + "/dice-2.png');");
        $('#bot_bottom').attr('style', "background-image: url('/static/assets/images/die/" + skins[index] + "/dice-5.png');");
    }

    function rollDice(number, die) {

        side = 'front';
        if (number == 1) {
            side = 'front';
        } else if (number == 2) {
            side = 'top';
        } else if (number == 3) {
            side = 'left';
        } else if (number == 4) {
            side = 'right';
        } else if (number == 5) {
            side = 'bottom';
        } else if (number == 6) {
            side = 'back';
        }

        var currentClass = die.attr('class').split(' ')[0];
        var newClass = 'show-' + side;

        die.removeClass();

        if (currentClass == newClass) {
            die.addClass(newClass + ' show-same');

            // Remove animation class after animation has finished
            setTimeout(function() {
                die.removeClass('show-same');
            }, animationSpeed);
        } else {
            die.addClass(newClass);
        }

        history.push(side);
    }

    function soundEffect(element) {
        var audio = $(element)[0];
        audio.pause();
        audio.currentTime = 0;
        audio.play();
    }

    socket.on('dice_results', async function(msg) {

        if (!msg.passed) {
            return failure(msg.msg);
        }

        rolling = true;
        soundEffect("#dice_roll");

        for (var i = 0; i < 2; i++) {

            rollDice(randomizeNumber(1, 6), dice);
            rollDice(randomizeNumber(1, 6), dice_bot);

            await sleep(300);
        }

        rollDice(msg.user, dice);
        rollDice(msg.bot, dice_bot);

        await sleep(700);
        rolling = false

        if (msg.won) {
            soundEffect("#dice_won");
            game_message("YOU HAVE WON!", msg.won);
        } else {
            soundEffect("#die_lost");
            game_message("YOU HAVE LOST!", msg.won);
        }

        socket.emit('get_balance', {token: token});

        var class_ = "game_lost"
        if (msg.won) {
            class_ = "game_won"
        }

        var temp = '<div class="row game_history"><div class="col"><div class="d-flex justify-content-center"><span class="game_history_amount ' + class_ + '">' + msg.amount + '</span> <svg style="padding-left: 3px;" width="20px" height="20px" viewBox="0 0 314 136" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="Balance_nanoLogo__3m3c2"><title>Group</title><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="nano-logo" transform="translate(0.500000, 0.800000)" fill="#FFFFFF" fill-rule="nonzero"><g id="Group" transform="translate(0.000000, -0.000000)"><path d="M179,67.2 C179,79.6 169,89.6 156.6,89.6 C144.2,89.6 134.2,79.6 134.2,67.2 C134.2,50.4 128.6,44.8 111.8,44.8 C95,44.8 89.5,50.5 89.5,67.2 C89.5,79.6 79.5,89.6 67.1,89.6 C54.7,89.6 44.7,79.6 44.7,67.2 C44.7,54.8 54.7,44.8 67.1,44.8 C83.9,44.8 89.5,39.2 89.5,22.4 C89.5,10 99.5,0 111.9,0 C124.3,0 134.3,10 134.3,22.4 C134.3,39.2 139.9,44.8 156.7,44.8 C168.9,44.9 179,54.9 179,67.2 Z" id="Path"></path><circle id="Oval" cx="22.4" cy="112" r="22.4"></circle><path d="M313.1,22.5 C313.1,34.9 303.1,44.9 290.7,44.9 C273.9,44.9 268.3,50.5 268.3,67.3 C268.3,79.7 258.3,89.7 245.9,89.7 C229.1,89.7 223.5,95.3 223.5,112.1 C223.5,124.5 213.5,134.5 201.1,134.5 C188.7,134.5 178.7,124.5 178.7,112.1 C178.7,99.7 188.7,89.7 201.1,89.7 C217.9,89.7 223.5,84.1 223.5,67.3 C223.5,54.9 233.5,44.9 245.9,44.9 C262.7,44.9 268.3,39.3 268.3,22.5 C268.3,10.1 278.3,0.1 290.7,0.1 C303.1,0.1 313.1,10.2 313.1,22.5 Z" id="Path"></path></g></g></g></svg></div></div><div class="col"><div class="d-flex justify-content-center"> <span class="history_time game_history_amount game_neutral" original="' + msg.time + '">' + timeDifference(msg.time) + ' </span></div></div><div class="col"><div class="d-flex justify-content-center"><span game_id="' + msg.game_id + '" class="show-click dice_game_id game_history_amount game_neutral dice_round">#' + msg.game_id.substring(0, 4) + '</button></div> </div></div>'
        $("#local_history").prepend(temp);

    });

    socket.on('dice_history', async function(msg) {

        var class_ = "game_lost"
        if (msg.won) {
            class_ = "game_won"
        }

        var temp = '<div class="row game_history"><div class="col"><div class="d-flex justify-content-center"><span class="game_history_amount ' + class_ + '">' + msg.amount + '</span> <svg style="padding-left: 3px;" width="20px" height="20px" viewBox="0 0 314 136" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="Balance_nanoLogo__3m3c2"><title>Group</title><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="nano-logo" transform="translate(0.500000, 0.800000)" fill="#FFFFFF" fill-rule="nonzero"><g id="Group" transform="translate(0.000000, -0.000000)"><path d="M179,67.2 C179,79.6 169,89.6 156.6,89.6 C144.2,89.6 134.2,79.6 134.2,67.2 C134.2,50.4 128.6,44.8 111.8,44.8 C95,44.8 89.5,50.5 89.5,67.2 C89.5,79.6 79.5,89.6 67.1,89.6 C54.7,89.6 44.7,79.6 44.7,67.2 C44.7,54.8 54.7,44.8 67.1,44.8 C83.9,44.8 89.5,39.2 89.5,22.4 C89.5,10 99.5,0 111.9,0 C124.3,0 134.3,10 134.3,22.4 C134.3,39.2 139.9,44.8 156.7,44.8 C168.9,44.9 179,54.9 179,67.2 Z" id="Path"></path><circle id="Oval" cx="22.4" cy="112" r="22.4"></circle><path d="M313.1,22.5 C313.1,34.9 303.1,44.9 290.7,44.9 C273.9,44.9 268.3,50.5 268.3,67.3 C268.3,79.7 258.3,89.7 245.9,89.7 C229.1,89.7 223.5,95.3 223.5,112.1 C223.5,124.5 213.5,134.5 201.1,134.5 C188.7,134.5 178.7,124.5 178.7,112.1 C178.7,99.7 188.7,89.7 201.1,89.7 C217.9,89.7 223.5,84.1 223.5,67.3 C223.5,54.9 233.5,44.9 245.9,44.9 C262.7,44.9 268.3,39.3 268.3,22.5 C268.3,10.1 278.3,0.1 290.7,0.1 C303.1,0.1 313.1,10.2 313.1,22.5 Z" id="Path"></path></g></g></g></svg></div></div><div class="col"><div class="d-flex justify-content-center"> <span class="history_time game_history_amount game_neutral" original="' + msg.time + '">' + timeDifference(msg.time) + ' </span></div></div><div class="col"><div class="d-flex justify-content-center"><span game_id="' + msg.game_id + '" class="show-click dice_game_id game_history_amount game_neutral dice_round">#' + msg.game_id.substring(0, 4) + '</button></div> </div></div>'

        if (msg.past) {
            $("#game_history").append(temp);
        } else {
            $("#game_history").prepend(temp);
        }

    });

    socket.on('dice_leaderboard', async function(msg) {

        var class_ = "game_lost"
        if (msg.won) {
            class_ = "game_won"
        }

        var temp = '<div class="row game_history"><div class="col"><div class="d-flex justify-content-center"><span class="game_history_amount ' + class_ + '">' + msg.amount + '</span> <svg style="padding-left: 3px;" width="20px" height="20px" viewBox="0 0 314 136" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="Balance_nanoLogo__3m3c2"><title>Group</title><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="nano-logo" transform="translate(0.500000, 0.800000)" fill="#FFFFFF" fill-rule="nonzero"><g id="Group" transform="translate(0.000000, -0.000000)"><path d="M179,67.2 C179,79.6 169,89.6 156.6,89.6 C144.2,89.6 134.2,79.6 134.2,67.2 C134.2,50.4 128.6,44.8 111.8,44.8 C95,44.8 89.5,50.5 89.5,67.2 C89.5,79.6 79.5,89.6 67.1,89.6 C54.7,89.6 44.7,79.6 44.7,67.2 C44.7,54.8 54.7,44.8 67.1,44.8 C83.9,44.8 89.5,39.2 89.5,22.4 C89.5,10 99.5,0 111.9,0 C124.3,0 134.3,10 134.3,22.4 C134.3,39.2 139.9,44.8 156.7,44.8 C168.9,44.9 179,54.9 179,67.2 Z" id="Path"></path><circle id="Oval" cx="22.4" cy="112" r="22.4"></circle><path d="M313.1,22.5 C313.1,34.9 303.1,44.9 290.7,44.9 C273.9,44.9 268.3,50.5 268.3,67.3 C268.3,79.7 258.3,89.7 245.9,89.7 C229.1,89.7 223.5,95.3 223.5,112.1 C223.5,124.5 213.5,134.5 201.1,134.5 C188.7,134.5 178.7,124.5 178.7,112.1 C178.7,99.7 188.7,89.7 201.1,89.7 C217.9,89.7 223.5,84.1 223.5,67.3 C223.5,54.9 233.5,44.9 245.9,44.9 C262.7,44.9 268.3,39.3 268.3,22.5 C268.3,10.1 278.3,0.1 290.7,0.1 C303.1,0.1 313.1,10.2 313.1,22.5 Z" id="Path"></path></g></g></g></svg></div></div><div class="col"><div class="d-flex justify-content-center"> <span class="game_history_amount game_neutral">' + msg.username + ' </span></div></div><div class="col"><div class="d-flex justify-content-center"><span game_id="' + msg.game_id + '" class="show-click dice_game_id game_history_amount game_neutral dice_round">#' + msg.game_id.substring(0, 4) + '</button></div> </div></div>'

         $("#leader_board").append(temp);
    });

    socket.on('dice_round', async function(msg) {

        console.log(msg)

        remove_popup();
        var color = "var(--green)"
        var message = "WON"

        var higher_style = ""
        var lower_style = ""

        if (msg.side) {
            lower_style = "background-color: #343434; border: 1px white solid;"
        }
        else {
            higher_style = "background-color: #343434; border: 1px white solid;"
        }

        if (!msg.won) {
            color = "var(--red)"
            message = "LOST"
        }

        var game_html = `<div id="dice_data_popup">
        <div class="popup-bg popup-confirm">
            <div class="popup">

                <div class="popup-inner" style="border: 1px white solid">

                    <div class="popup-header" style="background-color: #141414">
                        <span>Game #${msg.game_id}</span>
                        <button id="close_popup" class="cross_button">X</button>
                    </div>

                    <div class="popup-content" style="position: relative;">
                        <div class="d-flex justify-content-center align-items-center" style="margin-bottom: 1rem">
                            <button class="no-click game_outcome_text" style="background-color: ${color}; color: #FFFFFF; width: 150px;">${message}</button>
                        </div>

                        <div class="row" style="padding: 1rem;">
                            <div class="col">

                                <div class="d-flex justify-content-center align-items-center">

                                    <!-- Dice -->
                                    <div>

                                        <div class="d-flex justify-content-center">
                                            <div style="display: block; ">
                                                <span class="side_text text-center">USER</span>
                                            </div>
                                        </div>

                                        <div class="d-flex justify-content-center">
                                            <div style="display: block; margin: 1rem;">
                                                <img style="border: 1px solid" class="image" src="/static/assets/images/die/${msg.image}/dice-${msg.user_roll}.png">
                                            </div>
                                        </div>

                                    </div>

                                    <div>

                                        <div class="d-flex justify-content-center">
                                            <div style="display: block; ">
                                                <span class="side_text text-center">BOT</span>
                                            </div>
                                        </div>

                                        <div class="d-flex justify-content-center">
                                            <div style="display: block; margin: 1rem;">
                                                <img class="image" src="/static/assets/images/die/red_corner/dice-${msg.bot_roll}.png">
                                            </div>
                                        </div>

                                    </div>

                                </div>

                            </div>
                        </div>

                        <div class="row">

                            <div class="col">

                                <div class="pull-right" style="text-align: right;">
                                    <span class="payout" style="display: block; ">Bet </span>
                                </div>

                                <div class="pull-right" style="text-align: right;">
                                    <span class="payout" style="display: block; ">Outcome </span>
                                </div>

                            </div>

                            <div class="col" style="width: 10px; max-width: 10px;">

                                <div class="d-flex justify-content-center align-items-center">
                                    <span class="payout_equal" style="display: block; ">=</span>
                                </div>

                                <div class="d-flex justify-content-center align-items-center">
                                    <span class="payout_equal" style="display: block; ">=</span>
                                </div>

                            </div>

                            <div class="col float-end">

                                <span class="payout_multi" style="display: block; color: var(--darkwhite);"><span>&nbsp;</span>${msg.bet_amount}</span>
                                <span class="payout_multi" style="display: block; color: ${color}">${msg.outcome}</span>

                            </div>

                        </div>

                        <div class="game_info_left hidden-mobile-small" style="margin-bottom: 1rem">
                            <span style="display: block;" class="side_text_info">Played: <span class="nano_square">${time_human(msg.time)}</span></span>
                            <span style="display: block;" class="side_text_info">Game: <span class="nano_square">${msg.game_number}</span></span>
                        </div>

                        <div class="row" style="padding: 2rem;">

                        <div class="col">
                            <div>
                                <button class="lower_button no-click" style="${lower_style}" id="lower">Lower</button>
                            </div>
                        </div>

                        <div class="col">
                            <div>
                                <button class="higher_button no-click" style="${higher_style}" id="higher">Higher</button>
                            </div>
                        </div>

                    </div>

                    </div>

                </div>

            </div>
        </div>
    </div>`

        $("body").append(game_html);
    });

    $('#lower').on('click ', function() {
        if (!rolling) {
            const bet_amount = document.getElementById("bet_amount").value;
            socket.emit('play_dice', {
                bet: parseFloat(bet_amount),
                side: 0,
                token: token
            });
        }
    });

    $('#higher').on('click ', function() {
        if (!rolling) {
            const bet_amount = document.getElementById("bet_amount").value;
            socket.emit('play_dice', {
                bet: parseFloat(bet_amount),
                side: 1,
                token: token
            });
        }
    });

    $('.use_dice').on('click ', function() {
        var dice = $(this).attr('dice');
        user_skin(die_skins.indexOf(dice), false);
    });

    $('.buy_dice').on('click ', function() {
        var dice = $(this).attr('dice');
        if (confirm("Do you wish to purchase this dice?")) {
            socket.emit('buy_dice', {
                dice: dice,
                token: token
            });
        }
    });

    $('.buy_color').on('click ', function() {
        var color = $(this).attr('color');
        if (confirm("Do you wish to purchase this color?")) {
            socket.emit('buy_color', {
                color: color,
                token: token
            });
        }
    });

    $('.use_color').on('click ', function() {
         var color = $(this).attr('color');
         socket.emit('color_update', {
                color: color,
                token: token
          });
    });

    $(document).on('click', '.dice_round', function() {
        var dice = $(this).attr('game_id');
        socket.emit('dice_data', {
            game_id: dice,
            token: token
        });
    });

    $(document).on('click', '#close_popup', function() {
        remove_popup();
    });


    bot_skin(1)
    user_skin(0, true)

    setTimeout(function() {socket.emit('request_dice_history', {token: token});}, 3500)
    setTimeout(function() {socket.emit('request_leaderboard', {token: token});}, 3000)
});
