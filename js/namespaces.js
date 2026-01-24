// Main namespace
var OpticalMediaGood = OpticalMediaGood || {};


// Constants
OpticalMediaGood.Suffixes = {
    TITLEBAR: '-titlebar',
    TAB: '-tab'
};

OpticalMediaGood.Supports3DTransform = (function() {
    var elmt = document.createElement('p');
    var has3d;
    var transforms = {
        'webkitTransform': '-webkit-transform',
        'OTransform': '-o-transform',
        'msTransform': '-ms-transform',
        'MozTransform': '-moz-transform',
        'transform': 'transform'
    };

    document.body.insertBefore(elmt, null);

    for (var t in transforms) {
        if (elmt.style[t] !== undefined) {
            elmt.style[t] = "translate3d(1px,1px,1px)";
            has3d = getComputedStyleCompat(elmt).getPropertyValue(transforms[t]);
        }
    }

    document.body.removeChild(elmt);

    return (has3d !== undefined && has3d !== null && has3d.length > 0 && has3d !== "none");
})();


// Other namespaces
OpticalMediaGood.WindowManager = {};
OpticalMediaGood.WindowManager.Renderer = {};
OpticalMediaGood.WindowManager.State = {};
OpticalMediaGood.WindowManager.Init = {};

OpticalMediaGood.IEBrowser = {};
OpticalMediaGood.Utils = {};

OpticalMediaGood.windowStates = {};
