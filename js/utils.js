OpticalMediaGood.Utils.setTranslate = function(xPos, yPos, el) {
    setPositionCompat(el, xPos, yPos);
};


OpticalMediaGood.Utils.updateTime = function(timeElement) {
    var now = new Date();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    var minutesStr = minutes < 10 ? '0' + minutes : minutes;
    var seconds = now.getSeconds() < 10 ? '0' + now.getSeconds() : now.getSeconds();
    var timeStr = hours + ':' + minutesStr + ':' + seconds + ' ' + ampm;
    timeElement.innerHTML = timeStr;
};
