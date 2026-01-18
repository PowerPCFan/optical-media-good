var windows = [
    {
        id: 'ie-window',
        title: 'Microsoft Internet Explorer',
        content: '<div style="margin: 0; padding: 0;">' +
            '<div style="padding: 4px; border-bottom: 1px solid #808080; background: #f0f0f0;">' +
                '<div style="display: flex; align-items: center; gap: 4px;">' +
                    '<button onclick="ieGoBack()" style="width: 28px; height: 28px; padding: 2px; display: flex; align-items: center; justify-content: center;">' +
                        '<img src="img/ie/back.png" style="width: 16px; height: 16px;">' +
                    '</button>' +
                    '<button onclick="ieGoForward()" style="width: 28px; height: 28px; padding: 2px; display: flex; align-items: center; justify-content: center;">' +
                        '<img src="img/ie/forward.png" style="width: 16px; height: 16px;">' +
                    '</button>' +
                    '<button onclick="ieStop()" style="width: 28px; height: 28px; padding: 2px; display: flex; align-items: center; justify-content: center;">' +
                        '<img src="img/ie/stop.png" style="width: 16px; height: 16px;">' +
                    '</button>' +
                    '<button onclick="ieRefresh()" style="width: 28px; height: 28px; padding: 2px; display: flex; align-items: center; justify-content: center;">' +
                        '<img src="img/ie/refresh.png" style="width: 16px; height: 16px;">' +
                    '</button>' +
                    '<button onclick="ieHome()" style="width: 28px; height: 28px; padding: 2px; display: flex; align-items: center; justify-content: center;">' +
                        '<img src="img/ie/home.png" style="width: 16px; height: 16px;">' +
                    '</button>' +
                    '<span style="margin: 0 8px;">Address</span>' +
                    '<input type="text" id="ie-address-bar" value="https://www.google.com/" onkeypress="ieAddressKeyPress(event)" style="flex: 1; margin-right: 4px; height: 22px;">' +
                    '<button onclick="ieGo()" style="height: 26px; padding: 2px 8px; display: flex; align-items: center; gap: 4px;">' +
                        '<img src="img/ie/go.png" style="width: 16px; height: 16px;">' +
                        '<span>Go</span>' +
                    '</button>' +
                '</div>' +
            '</div>' +
            '<iframe id="ie-iframe" src="https://www.google.com/webhp?igu=1" style="width: 100%; height: 400px; border: none; background: white;"></iframe>' +
        '</div>',
        icon: 'img/apps/ie6.png',
        taskbarText: 'Internet Explorer',
        width: '700px',
        height: '500px',
        initialX: 300,
        initialY: 250,
        active: false
    },
    {
        id: 'cmd-window',
        title: 'C:\\WINDOWS\\system32\\cmd.exe',
        content: '<pre style="width: 100%; box-sizing: border-box; padding: 8px !important; display: inline-block; white-space: pre-wrap !important; word-break: break-all !important; overflow-wrap: anywhere !important; word-wrap: break-word !important; hyphens: none !important; max-width: 100%;">' +
'Microsoft Windows XP [Version 5.1.2600]' +
'&#10094;C&#10095; Copyright 1985-2001 Microsoft Corp.' +
'<br>C:&#92;Documents and Settings&#92;Optical Media Good&#92;Website> type index.html&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
        '<h2 style="margin-top: 8px;" class="heading">Optical Media Good</h2>' +
'<br>C:&#92;Documents and Settings&#92;Optical Media Good&#92;Website><span id="blink">▋</span>' +
    '</pre>',
        icon: 'img/apps/cmd.png',
        taskbarText: 'Command Prompt',
        width: '90ch',
        height: 'auto',
        windowBodyStyle: 'padding: 0 !important;',
        style: null,
        initialX: 30,
        initialY: 30,
        active: true
    }
];

var windowStates = {};

function createWindowHTML(windowConfig) {
    var widthStyle = 'width: ' + windowConfig.width + ';';
    var heightStyle = windowConfig.height ? 'height: ' + windowConfig.height + ';' : '';
    var customStyle = windowConfig.style ? windowConfig.style : '';
    var displayStyle = windowConfig.active ? 'display: block;' : 'display: none;';

    return '' +
        '<div class="window" id="' + windowConfig.id + '" style="' + widthStyle + ' ' + heightStyle + ' ' + displayStyle + ' ' + customStyle + '">' +
            '<div class="title-bar" data-window-id="' + windowConfig.id + '">' +
                '<div class="title-bar-text">' + windowConfig.title + '</div>' +
                '<div class="title-bar-controls">' +
                    '<button class="minimize-btn" aria-label="Minimize"></button>' +
                    '<button class="maximize-btn" aria-label="Maximize"></button>' +
                    '<button class="close-btn" aria-label="Close"></button>' +
                '</div>' +
            '</div>' +
            '<div class="window-body" style="' + (windowConfig.height ? 'height: ' + windowConfig.height + ';' : '') + ' ' + (windowConfig.windowBodyStyle ? windowConfig.windowBodyStyle : '') + '">' +
                windowConfig.content +
            '</div>' +
        '</div>';
}

function createTaskbarTabHTML(windowConfig) {
    return '' +
        '<div class="open-tab ' + (windowConfig.active ? 'active' : '') + '" data-window-id="' + windowConfig.id + '">' +
            '<img src="' + windowConfig.icon + '"> ' + windowConfig.taskbarText +
        '</div>';
}

function initializeWindows() {
    var windowsContainer = document.getElementById('windows-container');
    var taskbarTabs = document.getElementById('taskbar-tabs');

    for (var i = 0; i < windows.length; i++) {
        var windowConfig = windows[i];
        windowsContainer.innerHTML += createWindowHTML(windowConfig);
        taskbarTabs.innerHTML += createTaskbarTabHTML(windowConfig);

        windowStates[windowConfig.id] = {
            isMaximized: false,
            isMinimized: false,
            originalStyles: {},
            xOffset: windowConfig.initialX,
            yOffset: windowConfig.initialY,
            isDragging: false
        };

        var windowElement = document.getElementById(windowConfig.id);
        setTranslate(windowConfig.initialX, windowConfig.initialY, windowElement);
    }

    for (var k = 0; k < windows.length; k++) {
        var windowConfig = windows[k];
        if (windowConfig.active) {
            focusWindow(windowConfig.id);
        }
    }

    initializeDragSystem();
    initializeWindowControls();
    initializeTaskbar();
    initializeDesktopClick();
}

function initializeDesktopClick() {
    addEventCompat(document, 'click', function(e) {
        var target = e.target || e.srcElement;
        
        var clickedOnUI = false;
        var current = target;
        
        while (current && current !== document && current !== null) {
            if (current.nodeType !== 1) {
                current = current.parentNode;
                continue;
            }
            
            var className = current.className || '';
            var id = current.id || '';
            
            if (className.indexOf('window') !== -1 || 
                className.indexOf('title-bar') !== -1 ||
                className.indexOf('taskbar') !== -1 || 
                className.indexOf('open-tab') !== -1 ||
                className.indexOf('start-button') !== -1 ||
                className.indexOf('time') !== -1 ||
                id === 'windows-container' || 
                id === 'taskbar-tabs' ||
                id.indexOf('window') !== -1 ||
                id.indexOf('ie-') === 0 ||
                id === 'blink' ||
                current.tagName === 'IFRAME' ||
                current.tagName === 'BUTTON' ||
                current.tagName === 'INPUT') {
                clickedOnUI = true;
                break;
            }
            
            current = current.parentNode;
        }
        
        if (!clickedOnUI) {
            unfocusAllWindows();
        }
    });
}

function initializeDragSystem() {
    var currentDragWindow = null;
    var initialX, initialY, currentX, currentY;

    function dragStart(e) {
        var titleBar = e.target.closest ? e.target.closest('.title-bar') : getClosestElement(e.target, '.title-bar');
        if (!titleBar) return;

        var windowId = titleBar.getAttribute('data-window-id');
        var windowElement = document.getElementById(windowId);
        var state = windowStates[windowId];

        var clientX, clientY;
        if (e.type === "touchstart") {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        initialX = clientX - state.xOffset;
        initialY = clientY - state.yOffset;

        if (e.target === titleBar || containsElement(titleBar, e.target)) {
            if (state.isMaximized) {
                restoreWindow(windowId);

                var rect = getBoundingRectCompat(windowElement);

                var newX = clientX - rect.width / 2;
                var newY = clientY - 15;

                state.xOffset = newX;
                state.yOffset = newY;

                initialX = clientX - newX;
                initialY = clientY - newY;

                setTranslate(newX, newY, windowElement);
            }
            
            state.isDragging = true;
            currentDragWindow = windowId;
            addClass(windowElement, 'dragging');
            focusWindow(windowId);
        }
    }

    function dragEnd() {
        if (currentDragWindow) {
            var state = windowStates[currentDragWindow];
            var windowElement = document.getElementById(currentDragWindow);
            
            initialX = currentX;
            initialY = currentY;
            state.isDragging = false;
            removeClass(windowElement, 'dragging');
            currentDragWindow = null;
        }
    }

    function drag(e) {
        if (!currentDragWindow) return;

        var state = windowStates[currentDragWindow];
        var windowElement = document.getElementById(currentDragWindow);

        if (state.isDragging) {
            e.preventDefault();
            
            if (e.type === "touchmove") {
                currentX = e.touches[0].clientX - initialX;
                currentY = e.touches[0].clientY - initialY;
            } else {
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
            }

            state.xOffset = currentX;
            state.yOffset = currentY;

            setTranslate(currentX, currentY, windowElement);
        }
    }

    addEventCompat(document, "mousedown", dragStart);
    addEventCompat(document, "mouseup", dragEnd);
    addEventCompat(document, "mousemove", drag);
    addEventCompat(document, "touchstart", dragStart);
    addEventCompat(document, "touchend", dragEnd);
    addEventCompat(document, "touchmove", drag);
}

function initializeWindowControls() {
    addEventCompat(document, 'mousedown', function(e) {
        var titleBar = getClosestElement(e.target, '.title-bar');
        var windowElement = getClosestElement(e.target, '.window');
        
        if (titleBar) {
            var windowId = titleBar.getAttribute('data-window-id');
            focusWindow(windowId);
        } else if (windowElement) {
            var windowId = windowElement.id;
            focusWindow(windowId);
        }
    });
    
    addEventCompat(document, 'click', function(e) {
        var button = e.target;
        var titleBar = getClosestElement(button, '.title-bar');
        if (!titleBar) return;
        
        var windowId = titleBar.getAttribute('data-window-id');
        var windowElement = document.getElementById(windowId);
        var state = windowStates[windowId];
        
        e.stopPropagation();
        
        if (hasClass(button, 'minimize-btn')) {
            windowElement.style.display = "none";
            state.isMinimized = true;
            updateTaskbarForVisibleWindows();
        } else if (hasClass(button, 'close-btn')) {
            windowElement.style.display = "none";
            state.isMinimized = false;
            updateTaskbarForVisibleWindows();

            var originalConfig = findInArray(windows, function(w) { return w.id === windowId; });
            if (originalConfig) {
                state.xOffset = originalConfig.initialX;
                state.yOffset = originalConfig.initialY;
            }
        } else if (hasClass(button, 'maximize-btn')) {
            toggleMaximize(windowId);
        }
    });
}

function initializeTaskbar() {
    addEventCompat(document, 'click', function(e) {
        var tab = getClosestElement(e.target, '.open-tab');
        if (!tab) return;
        
        var windowId = tab.getAttribute('data-window-id');
        var windowElement = document.getElementById(windowId);
        var state = windowStates[windowId];
        
        e.stopPropagation();
        
        if (windowElement.style.display === "none") {
            windowElement.style.display = "block";
            setTranslate(state.xOffset, state.yOffset, windowElement);
            focusWindow(windowId);
        } else if (hasClass(tab, 'active')) {
            windowElement.style.display = "none";
            state.isMinimized = true;
            updateTaskbarForVisibleWindows();
        } else {
            focusWindow(windowId);
        }
    });
}

function toggleMaximize(windowId) {
    var state = windowStates[windowId];
    var windowElement = document.getElementById(windowId);
    var taskbarTab = querySelectorCompat('[data-window-id="' + windowId + '"]');
    focusWindow(windowId);

    if (!state.isMaximized) {
        var computedStyle = window.getComputedStyle ? window.getComputedStyle(windowElement) : null;

        state.originalStyles = {
            width: windowElement.style.width || (computedStyle ? computedStyle.width : ''),
            height: windowElement.style.height || (computedStyle ? computedStyle.height : ''),
            transform: windowElement.style.transform || "translate3d(0px, 0px, 0)",
            top: windowElement.style.top || "auto",
            left: windowElement.style.left || "auto",
            right: windowElement.style.right || "auto",
            bottom: windowElement.style.bottom || "auto",
            position: windowElement.style.position || "absolute",
            xOffset: state.xOffset,
            yOffset: state.yOffset
        };

        windowElement.style.width = "100%";
        windowElement.style.height = "90%";
        windowElement.style.transform = "translate3d(0px, 0px, 0)";
        windowElement.style.top = "0";
        windowElement.style.left = "0";
        windowElement.style.right = "auto";
        windowElement.style.bottom = "auto";
        windowElement.style.position = "absolute";

        state.xOffset = 0;
        state.yOffset = 0;
        state.isMaximized = true;
        addClass(taskbarTab, 'active');
    } else {
        restoreWindow(windowId);
        state.xOffset = state.originalStyles.xOffset || 0;
        state.yOffset = state.originalStyles.yOffset || 0;
        addClass(taskbarTab, 'active');
    }
}

function restoreWindow(windowId) {
    var state = windowStates[windowId];
    var windowElement = document.getElementById(windowId);

    for (var key in state.originalStyles) {
        if (key !== 'xOffset' && key !== 'yOffset') {
            windowElement.style[key] = state.originalStyles[key];
        }
    }
    state.isMaximized = false;
}

function setTranslate(xPos, yPos, el) {
    setPositionCompat(el, xPos, yPos);
}

function focusWindow(windowId) {
    var allWindows = querySelectorAllCompat('.window');

    for (var i = 0; i < allWindows.length; i++) {
        var win = allWindows[i];

        if (win.id === windowId) {
            win.style.zIndex = 1000 + allWindows.length;
        } else {
            win.style.zIndex = 1000 + i;
        }
        removeClass(win, 'window-active');
    }

    var windowElement = document.getElementById(windowId);

    if (windowElement) {
        addClass(windowElement, 'window-active');
    }

    updateTaskbarActiveState(windowId);
}

function updateTaskbarActiveState(activeWindowId) {
    var taskbarContainer = document.getElementById('taskbar-tabs');
    if (!taskbarContainer) return;

    var allTabElements = taskbarContainer.getElementsByTagName('div');

    for (var i = 0; i < allTabElements.length; i++) {
        var tab = allTabElements[i];

        if (hasClass(tab, 'open-tab')) {
            var tabWindowId = tab.getAttribute('data-window-id');

            if (tabWindowId === activeWindowId) {
                addClass(tab, 'active');
            } else {
                removeClass(tab, 'active');
            }
        }
    }
}

function updateTaskbarForVisibleWindows() {
    var hasVisibleWindow = false;
    var visibleWindowId = null;

    for (var i = 0; i < windows.length; i++) {
        var windowElement = document.getElementById(windows[i].id);

        if (windowElement && windowElement.style.display !== 'none') {
            if (!hasVisibleWindow) {
                hasVisibleWindow = true;
                visibleWindowId = windows[i].id;
            }
        }
    }

    if (hasVisibleWindow && visibleWindowId) {
        focusWindow(visibleWindowId);
    } else {
        var taskbarContainer = document.getElementById('taskbar-tabs');

        if (taskbarContainer) {
            var allTabElements = taskbarContainer.getElementsByTagName('div');
            for (var j = 0; j < allTabElements.length; j++) {
                var tab = allTabElements[j];
                if (hasClass(tab, 'open-tab')) {
                    removeClass(tab, 'active');
                }
            }
        }
    }
}

function unfocusAllWindows() {
    var allWindows = querySelectorAllCompat('.window');

    for (var i = 0; i < allWindows.length; i++) {
        removeClass(allWindows[i], 'window-active');
        allWindows[i].style.zIndex = 1000 + i;
    }

    var taskbarContainer = document.getElementById('taskbar-tabs');
    if (taskbarContainer) {
        var allTabElements = taskbarContainer.getElementsByTagName('div');
        for (var j = 0; j < allTabElements.length; j++) {
            var tab = allTabElements[j];
            if (hasClass(tab, 'open-tab')) {
                removeClass(tab, 'active');
            }
        }
    }
}

function ieGoBack() {
    var iframe = document.getElementById('ie-iframe');
    if (iframe && iframe.contentWindow) {
        try {
            iframe.contentWindow.history.back();
        } catch (e) {
            // Cross-origin restriction
        }
    }
}

function ieGoForward() {
    var iframe = document.getElementById('ie-iframe');
    if (iframe && iframe.contentWindow) {
        try {
            iframe.contentWindow.history.forward();
        } catch (e) {
            // Cross-origin restriction
        }
    }
}

function ieStop() {
    var iframe = document.getElementById('ie-iframe');
    if (iframe) {
        iframe.src = iframe.src;
    }
}

function ieRefresh() {
    var iframe = document.getElementById('ie-iframe');
    var addressBar = document.getElementById('ie-address-bar');
    if (iframe && addressBar) {
        iframe.src = addressBar.value;
    }
}

function ieHome() {
    var iframe = document.getElementById('ie-iframe');
    var addressBar = document.getElementById('ie-address-bar');
    var homeUrl = 'https://www.google.com/webhp?igu=1';
    if (iframe && addressBar) {
        iframe.src = homeUrl;
        addressBar.value = 'https://www.google.com/';
    }
}

function ieGo() {
    var iframe = document.getElementById('ie-iframe');
    var addressBar = document.getElementById('ie-address-bar');
    if (iframe && addressBar) {
        var url = addressBar.value;

        if (url.replace) {
            url = url.replace(/^\s+|\s+$/g, '');
        }
        if (url && url.indexOf('http://') !== 0 && url.indexOf('https://') !== 0) {
            url = 'https://' + url;
            addressBar.value = url;
        }
        iframe.src = url;
    }
}

function ieAddressKeyPress(event) {
    if (event.key === 'Enter') {
        ieGo();
    }
}

function updateTime(timeElement) {
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
}

addEventCompat(document, 'DOMContentLoaded', function() {
    initializeWindows();

    var timeElement = document.getElementById('time');
    var blink = document.getElementById('blink');
    
    setInterval(function() {
        updateTime(timeElement);
        if (blink) {
            blink.style.opacity = blink.style.opacity === '0' ? '1' : '0';
        }
    }, 1000);
});