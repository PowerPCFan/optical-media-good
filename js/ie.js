// not sure if i need this with the setPositionCompat changes but its probably safer to keep it
// use absolute positioning for window movement
OpticalMediaGood.Utils.setTranslate = function(xPos, yPos, el) {
    el.style.position = 'absolute';
    el.style.left = xPos + 'px';
    el.style.top = yPos + 'px';
};
