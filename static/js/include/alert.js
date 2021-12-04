function success(msg) {
    $('#notifyType').attr('data-text', msg);
 $('.notify').attr('style', "background: linear-gradient(#90ee90 , #90ee80, #90ee90 ); color: black;");

    $(".notify").toggleClass("active");
    $("#notifyType").toggleClass("success");

    setTimeout(function() {
        $(".notify").removeClass("active");
        $("#notifyType").removeClass("success");
    }, 2000);
}

function failure(msg) {
    $('#notifyType').attr('data-text', msg);
    $('.notify').attr('style', "background: linear-gradient(#FF7F7F , #FF6F6F, #FF7F7F ); color: black;");

    $(".notify").addClass("active");
    $("#notifyType").addClass("failure");

    setTimeout(function() {
        $(".notify").removeClass("active");
        $("#notifyType").removeClass("failure");
    }, 2000);
}

function game_message(msg, won) {

    $('#game_outcome').html(msg);

    class_ = "background-color: var(--green); color: #FFFFFF;"
    if (!won) {
        class_ = "background-color: var(--red); color: #FFFFFF;"
    }

    $('#game_outcome').attr('style', class_);
}