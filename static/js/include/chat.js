$(document).ready(function() {

    $('#chat_button').on('click ', function() {
        var chat_message = document.getElementById("chat").value;
        document.getElementById("chat").value = ""

        socket.emit('send_message', {
            msg: chat_message,
            token: token
        });
    });

    $('#change_username').on('click ', function() {
        Popup.prompt("What username do you want?", function(input_val) {
             if (input_val.length > 0) {
                socket.emit('change_username', {username: input_val, token: token});
             }
        });

    });

    socket.on('message', function(msg) {
        if (msg.passed) {
            success(msg.msg);
        } else {
            failure(msg.msg);
        }
    });

    socket.on('new_messages', async function(msg) {
        var temp = '<div style="margin: 10px;"><div style="display:inline-block; padding-right: 5px; padding-top: 10px;" class="align-top"><img style="background-color: #FFFFFF;width: 25x; height: 25px;" src="/static/assets/images/die/' + msg.img + '/dice-1.png"></div><div class="chat_messages"><span class="chat_username" style="color: ' + msg.color + '">' + msg.username + '</span>: <span> </span> <span class="chat_message">' + msg.msg + '</span><br><span class="chat_time history_time" original="' + msg.time + '">' + timeDifference(msg.time) + '</span></div></div>'
        var chat_history = $("#chat_history");

        if (msg.past) {
            chat_history.prepend(temp);
        }
        else {
            chat_history.append(temp);
        }

        chat_history.scrollTop(chat_history.prop("scrollHeight"));
    });

    var input = document.getElementById("chat");
    input.addEventListener("keyup", function(event) {

        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById("chat_button").click();
        }

    });

    setTimeout(function() { socket.emit('request_chat', {token: token});}, 4000)
})
