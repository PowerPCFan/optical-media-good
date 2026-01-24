OpticalMediaGood.IEBrowser.goBack = function() {
    var iframe = document.getElementById('ie-iframe');
    if (iframe && iframe.contentWindow) {
        try {
            iframe.contentWindow.history.back();
        } catch (e) {
            // Cross-origin restriction
        }
    }
};


OpticalMediaGood.IEBrowser.goForward = function() {
    var iframe = document.getElementById('ie-iframe');
    if (iframe && iframe.contentWindow) {
        try {
            iframe.contentWindow.history.forward();
        } catch (e) {
            // Cross-origin restriction
        }
    }
};


OpticalMediaGood.IEBrowser.stop = function() {
    var iframe = document.getElementById('ie-iframe');
    if (iframe) {
        iframe.src = iframe.src;
    }
};


OpticalMediaGood.IEBrowser.refresh = function() {
    var iframe = document.getElementById('ie-iframe');
    var addressBar = document.getElementById('ie-address-bar');
    if (iframe && addressBar) {
        iframe.src = addressBar.value;
    }
};


OpticalMediaGood.IEBrowser.home = function() {
    var iframe = document.getElementById('ie-iframe');
    var addressBar = document.getElementById('ie-address-bar');
    var homeUrl = 'http://frogfind.com/';
    if (iframe && addressBar) {
        iframe.src = homeUrl;
        addressBar.value = 'http://frogfind.com/';
    }
};


OpticalMediaGood.IEBrowser.go = function() {
    var iframe = document.getElementById('ie-iframe');
    var addressBar = document.getElementById('ie-address-bar');
    if (iframe && addressBar) {
        var url = addressBar.value;

        if (url.replace) {
            url = url.replace(/^\s+|\s+$/g, '');
        }
        if (url && url.indexOf('http://') !== 0 && url.indexOf('https://') !== 0) {
            url = 'http://' + url;
            addressBar.value = url;
        }
        iframe.src = url;
    }
};


OpticalMediaGood.IEBrowser.addressKeyPress = function(event) {
    event = event || window.event;

    var key = event.key || event.keyCode;
    if (key === 'Enter' || key === 13) {
        OpticalMediaGood.IEBrowser.go();
    }
};


// global wrappers for use in HTML
function ieGoBack() { OpticalMediaGood.IEBrowser.goBack(); }
function ieGoForward() { OpticalMediaGood.IEBrowser.goForward(); }
function ieStop() { OpticalMediaGood.IEBrowser.stop(); }
function ieRefresh() { OpticalMediaGood.IEBrowser.refresh(); }
function ieHome() { OpticalMediaGood.IEBrowser.home(); }
function ieGo() { OpticalMediaGood.IEBrowser.go(); }
function ieAddressKeyPress(event) {
    event = event || window.event;
    OpticalMediaGood.IEBrowser.addressKeyPress(event);
}
