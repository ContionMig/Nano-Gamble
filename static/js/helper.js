function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function randomizeNumber(low, high) {
    var random = Math.floor((Math.random() * high) + low);
    return random;
}

function timeDifference(previous) {

    var current = Math.floor(new Date().getTime() / 1000);

    var msPerMinute = 60;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < 0) {
        elapsed = 1;
    }

    if (elapsed < msPerMinute) {
         return Math.round(elapsed) + ' sec ago';
    }

    else if (elapsed < msPerHour) {
         return Math.round(elapsed/msPerMinute) + ' min ago';
    }

    else if (elapsed < msPerDay ) {
         return Math.round(elapsed/msPerHour ) + ' hour ago';
    }

    else if (elapsed < msPerMonth) {
        return Math.round(elapsed/msPerDay) + ' days ago';
    }

    else if (elapsed < msPerYear) {
        return Math.round(elapsed/msPerMonth) + ' mon ago';
    }

    else {
        return Math.round(elapsed/msPerYear ) + ' year ago';
    }
}

var curr_count = false
function countdown(elementName, minutes, seconds )
{

    if (curr_count) {
        return;
    }

    curr_count = true
    var element, endTime, hours, mins, msLeft, time;

    function twoDigits( n )
    {
        return (n <= 9 ? "0" + n : n);
    }

    function updateTimer()
    {
        msLeft = endTime - (+new Date);
        if ( msLeft < 1000 ) {
            element.innerHTML = "";
            curr_count = false
        } else {
            time = new Date( msLeft );
            hours = time.getUTCHours();
            mins = time.getUTCMinutes();
            element.innerHTML = (hours ? hours + ':' + twoDigits( mins ) : mins) + ':' + twoDigits( time.getUTCSeconds() );
            setTimeout( updateTimer, time.getUTCMilliseconds() + 500 );
        }
    }

    element = document.getElementById( elementName );
    endTime = (+new Date) + 1000 * (60*minutes + seconds) + 500;
    updateTimer();
}


function copy_clipboard(text) {
  if (!navigator.clipboard) {
    document.execCommand('copy');
    return;
  }
  navigator.clipboard.writeText(text)
}

function time_human(UNIX_timestamp){
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;

  return time;
}