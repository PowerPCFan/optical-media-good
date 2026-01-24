OpticalMediaGood.WindowManager.Renderer.createWindowHTML = function(windowConfig) {
    var widthStyle = 'width: ' + windowConfig.width + ';';
    var heightStyle = windowConfig.height ? 'height: ' + windowConfig.height + ';' : '';
    var customStyle = windowConfig.style ? windowConfig.style : '';
    var displayStyle = windowConfig.active ? 'display: block;' : 'display: none;';

    return '' +
        '<div class="window" id="' + windowConfig.id + '" style="' + widthStyle + ' ' + heightStyle + ' ' + displayStyle + ' ' + customStyle + '">' +
            '<div class="title-bar" id="' + windowConfig.id + OpticalMediaGood.Suffixes.TITLEBAR + '">' +
                '<div class="title-bar-text">' + windowConfig.title + '</div>' +
                '<div class="title-bar-controls">' +
                    '<button class="minimize-btn"></button>' +
                    '<button class="maximize-btn"></button>' +
                    '<button class="close-btn"></button>' +
                '</div>' +
            '</div>' +
            '<div class="window-body" style="' + (windowConfig.height ? 'height: ' + windowConfig.height + ';' : '') + ' ' + (windowConfig.windowBodyStyle ? windowConfig.windowBodyStyle : '') + '">' +
                windowConfig.content +
            '</div>' +
        '</div>';
};


OpticalMediaGood.WindowManager.Renderer.createTaskbarTabHTML = function(windowConfig) {
    return '' +
        '<div class="open-tab ' + (windowConfig.active ? 'active' : '') + '" id="' + windowConfig.id + OpticalMediaGood.Suffixes.TAB + '">' +
            '<img src="' + windowConfig.icon + '"> ' + windowConfig.taskbarText +
        '</div>';
};


OpticalMediaGood.WindowManager.State.focusWindow = function(windowId) {
    var allWindows = querySelectorAllCompat('.window');

    for (var i = 0; i < allWindows.length; i++) {
        var win = allWindows[i];

        if (win.id === windowId) {
            win.style.zIndex = 1000 + allWindows.length;

            if (hasClass(win, 'window-inactive')) {
                removeClass(win, 'window-inactive');
            }

            if (!hasClass(win, 'window-active')) {
                addClass(win, 'window-active');
            }
        } else {
            win.style.zIndex = 1000 + i;

            if (hasClass(win, 'window-active')) {
                removeClass(win, 'window-active');
            }

            if (!hasClass(win, 'window-inactive')) {
                addClass(win, 'window-inactive');
            }
        }
    }

    var taskbarContainer = document.getElementById('taskbar-tabs');

    if (taskbarContainer) {
        var allTabs = taskbarContainer.getElementsByTagName('div');

        for (var j = 0; j < allTabs.length; j++) {
            var tab = allTabs[j];

            if (hasClass(tab, 'open-tab')) {
                if (tab.id === windowId + OpticalMediaGood.Suffixes.TAB) {
                    if (!hasClass(tab, 'active')) {
                        addClass(tab, 'active');
                    }
                } else {
                    if (hasClass(tab, 'active')) {
                        removeClass(tab, 'active');
                    }
                }
            }
        }
    }
};


OpticalMediaGood.WindowManager.State.updateTaskbarActiveState = function(activeWindowId) {
    var taskbarContainer = document.getElementById('taskbar-tabs');
    if (!taskbarContainer) return;

    var allTabElements = taskbarContainer.getElementsByTagName('div');

    for (var i = 0; i < allTabElements.length; i++) {
        var tab = allTabElements[i];

        if (hasClass(tab, 'open-tab')) {
            if (tab.id === activeWindowId + OpticalMediaGood.Suffixes.TAB) {
                if (!hasClass(tab, 'active')) {
                    addClass(tab, 'active');
                }
            } else {
                if (hasClass(tab, 'active')) {
                    removeClass(tab, 'active');
                }
            }
        }
    }
};


OpticalMediaGood.WindowManager.State.updateAllTaskbarTabs = function() {
    var visibleWindows = [];
    
    for (var i = 0; i < windows.length; i++) {
        var windowElement = document.getElementById(windows[i].id);

        if (windowElement && windowElement.style.display !== 'none') {
            visibleWindows.push({
                id: windows[i].id,
                zIndex: parseInt(windowElement.style.zIndex) || 1000
            });
        }
    }

    visibleWindows.sort(function(a, b) { return b.zIndex - a.zIndex; });

    var activeWindowId = visibleWindows.length > 0 ? visibleWindows[0].id : null;

    var taskbarContainer = document.getElementById('taskbar-tabs');
    if (!taskbarContainer) return;

    var allTabElements = taskbarContainer.getElementsByTagName('div');

    for (var j = 0; j < allTabElements.length; j++) {
        var tab = allTabElements[j];

        if (hasClass(tab, 'open-tab')) {
            if (activeWindowId && tab.id === activeWindowId + OpticalMediaGood.Suffixes.TAB) {
                if (!hasClass(tab, 'active')) {
                    addClass(tab, 'active');
                }
            } else {
                if (hasClass(tab, 'active')) {
                    removeClass(tab, 'active');
                }
            }
        }
    }
};


OpticalMediaGood.WindowManager.State.unfocusWindow = function(windowId) {
    var windowElement = document.getElementById(windowId);

    if (windowElement) {
        if (hasClass(windowElement, 'window-active')) {
            removeClass(windowElement, 'window-active');
        }

        if (!hasClass(windowElement, 'window-inactive')) {
            addClass(windowElement, 'window-inactive');
        }
    }
};


OpticalMediaGood.WindowManager.State.unfocusAllWindows = function() {
    var allWindows = querySelectorAllCompat('.window');

    for (var i = 0; i < allWindows.length; i++) {
        var wnd = allWindows[i];

        if (hasClass(wnd, 'window-active')) {
            removeClass(wnd, 'window-active');
        }

        if (!hasClass(wnd, 'window-inactive')) {
            addClass(wnd, 'window-inactive');
        }

        wnd.style.zIndex = 1000 + i;
    }

    var taskbarContainer = document.getElementById('taskbar-tabs');

    if (taskbarContainer) {
        var allTabs = taskbarContainer.getElementsByTagName('div');

        for (var j = 0; j < allTabs.length; j++) {
            var tab = allTabs[j];

            if (hasClass(tab, 'active')) {
                removeClass(tab, 'active');
            }
        }
    }
};


OpticalMediaGood.WindowManager.State.toggleMaximize = function(windowId, buttonElement) {
    var state = OpticalMediaGood.windowStates[windowId];
    var windowElement = document.getElementById(windowId);
    var taskbarTab = document.getElementById(windowId + OpticalMediaGood.Suffixes.TAB);
    this.focusWindow(windowId);

    if (!state.isMaximized) {
        // Window is being maximized

        var computedStyle = getComputedStyleCompat(windowElement);
        var defaultTransform = OpticalMediaGood.Supports3DTransform ? "translate3d(0px, 0px, 0)" : "translate(0px, 0px)";

        state.originalStyles = {
            width: windowElement.style.width || computedStyle.getPropertyValue('width'),
            height: windowElement.style.height || computedStyle.getPropertyValue('height'),
            transform: windowElement.style.transform || windowElement.style.msTransform || windowElement.style.mozTransform || windowElement.style.webkitTransform || defaultTransform,
            top: windowElement.style.top,
            left: windowElement.style.left,
            right: windowElement.style.right,
            bottom: windowElement.style.bottom,
            xOffset: state.xOffset,
            yOffset: state.yOffset
        };

        windowElement.style.width = "100%";
        windowElement.style.height = "90%";  // todo: figure out a better way to handle this- calc() is out of the question due to jankiness and lack of IE8 support, and vh units aren't supported either
        windowElement.style.msTransform = defaultTransform;
        windowElement.style.webkitTransform = defaultTransform;
        windowElement.style.mozTransform = defaultTransform;
        windowElement.style.transform = defaultTransform;
        windowElement.style.top = "0";
        windowElement.style.left = "0";
        windowElement.style.right = "auto";
        windowElement.style.bottom = "auto";

        state.xOffset = 0;
        state.yOffset = 0;
        state.isMaximized = true;

        if (!hasClass(taskbarTab, 'active')) {
            addClass(taskbarTab, 'active');
        }

        if (buttonElement) {
            // Change button to "restore" icon
            removeClass(buttonElement, 'maximize-btn');
            addClass(buttonElement, 'restore-btn');
        }

        // save state
        OpticalMediaGood.windowStates[windowId] = state;
    } else {
        this.restoreWindow(windowId, buttonElement);

        state.xOffset = state.originalStyles.xOffset || 0;
        state.yOffset = state.originalStyles.yOffset || 0;

        addClass(taskbarTab, 'active');
    }
};


OpticalMediaGood.WindowManager.State.restoreWindow = function(windowId, buttonElement) {
    // restores a maximized window to its original size and position

    var state = OpticalMediaGood.windowStates[windowId];
    var windowElement = document.getElementById(windowId);

    for (var key in state.originalStyles) {
        if (key !== 'xOffset' && key !== 'yOffset') {
            windowElement.style[key] = state.originalStyles[key];
        }
    }
    state.isMaximized = false;

    if (buttonElement) {
        // Change button to "maximize" icon
        removeClass(buttonElement, 'restore-btn');
        addClass(buttonElement, 'maximize-btn');
    }

    // save state
    OpticalMediaGood.windowStates[windowId] = state;
};


OpticalMediaGood.WindowManager.Init.initializeWindows = function() {
    var windowsContainer = document.getElementById('windows-container');
    var taskbarTabs = document.getElementById('taskbar-tabs');

    for (var i = 0; i < windows.length; i++) {
        var windowConfig = windows[i];
        windowsContainer.innerHTML += OpticalMediaGood.WindowManager.Renderer.createWindowHTML(windowConfig);
        taskbarTabs.innerHTML += OpticalMediaGood.WindowManager.Renderer.createTaskbarTabHTML(windowConfig);

        OpticalMediaGood.windowStates[windowConfig.id] = {
            isMaximized: false,
            isMinimized: false,
            originalStyles: {},
            xOffset: windowConfig.initialX,
            yOffset: windowConfig.initialY,
            isDragging: false
        };

        var windowElement = document.getElementById(windowConfig.id);
        OpticalMediaGood.Utils.setTranslate(windowConfig.initialX, windowConfig.initialY, windowElement);
    }

    for (var k = 0; k < windows.length; k++) {
        var windowConfig = windows[k];
        if (windowConfig.active) {
            OpticalMediaGood.WindowManager.State.focusWindow(windowConfig.id);
        }
    }

    OpticalMediaGood.WindowManager.Init.initializeDragSystem();
    OpticalMediaGood.WindowManager.Init.initializeWindowControls();
    OpticalMediaGood.WindowManager.Init.initializeTaskbar();
    OpticalMediaGood.WindowManager.Init.initializeDesktopClick();
};


OpticalMediaGood.WindowManager.Init.initializeDesktopClick = function() {
    addEventCompat(document, 'click', function(e) {
        e = e || window.event;
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
            OpticalMediaGood.WindowManager.State.unfocusAllWindows();
        }
    });

    addEventCompat(document, 'click', function(e) {
        e = e || window.event;
        var target = e.target || e.srcElement;
        var button = target.closest('.title-bar-controls button');

        if (button) {
            return;
        }

        var windowElement = target.closest('.window');
        var titleBar = target.closest('.title-bar');

        if (titleBar) {
            var windowId = titleBar.id.replace(OpticalMediaGood.Suffixes.TITLEBAR, '');
            OpticalMediaGood.WindowManager.State.focusWindow(windowId);
        } else if (windowElement) {
            var windowId = windowElement.id;
            OpticalMediaGood.WindowManager.State.focusWindow(windowId);
        }
    });
};


OpticalMediaGood.WindowManager.Init.initializeDragSystem = function() {
    var initialX = 0, initialY = 0;
    var currentX = 0, currentY = 0;
    var currentDragWindow = null;

    function isLeftClick(e) {
        e = e || window.event;

        if (document.addEventListener) {
            return e.button === 0;
        } else {
            // IE uses 1 for left click
            return e.button === 1;
        }
    }

    function dragStart(e) {
        e = e || window.event;
        var target = e.target || e.srcElement;

        if (!target) return;
        if (e.type === "mousedown" && !isLeftClick(e)) return;
        if (target.closest('.title-bar-controls')) return;

        var titleBar = target.closest('.title-bar');
        if (!titleBar) return;

        var windowId = titleBar.id.replace(OpticalMediaGood.Suffixes.TITLEBAR, '');
        currentDragWindow = windowId;
        OpticalMediaGood.WindowManager.State.focusWindow(windowId);
    }

    function dragEnd() {
        if (currentDragWindow) {
            var state = OpticalMediaGood.windowStates[currentDragWindow];
            var windowElement = document.getElementById(currentDragWindow);

            if (state.isDragging){
                initialX = currentX;
                initialY = currentY;
                state.isDragging = false;

                if (hasClass(windowElement, 'dragging')) {
                    removeClass(windowElement, 'dragging');
                }
            }

            currentDragWindow = null;
        }
    }

    function drag(e) {
        e = e || window.event;
        if (!currentDragWindow) return;

        var state = OpticalMediaGood.windowStates[currentDragWindow];
        var windowElement = document.getElementById(currentDragWindow);

        if (!state.isDragging) {
            var clientX, clientY;
            if (e.type === "touchmove") {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            } else {
                clientX = e.clientX;
                clientY = e.clientY;
            }

            if (!state.isMaximized) {
                initialX = clientX - state.xOffset;
                initialY = clientY - state.yOffset;
            } else {
                var windowWidth = windowElement.offsetWidth;
                var clickPercentage = clientX / windowWidth;
                var newWidth = parseInt(state.originalStyles.width) || 700;
                var newX = clientX - (newWidth * clickPercentage);
                var newY = clientY - 15;

                OpticalMediaGood.WindowManager.State.restoreWindow(currentDragWindow);
                state.xOffset = newX;
                state.yOffset = newY;

                initialX = clientX - newX;
                initialY = clientY - newY;

                OpticalMediaGood.Utils.setTranslate(newX, newY, windowElement);

                var titleBar = document.getElementById(currentDragWindow + OpticalMediaGood.Suffixes.TITLEBAR);
                if (titleBar) {
                    // i thought querySelector didn't work in IE8 but it seems to work fine? so i guess i'll leave this
                    var restoreBtn = titleBar.querySelector('.restore-btn');
                    if (restoreBtn) {
                        removeClass(restoreBtn, 'restore-btn');
                        addClass(restoreBtn, 'maximize-btn');
                    }
                }
            }

            state.isDragging = true;

            if (!hasClass(windowElement, 'dragging')) {
                addClass(windowElement, 'dragging');
            }
        } else {
            preventDefaultCompat(e);

            if (e.type === "touchmove") {
                currentX = e.touches[0].clientX - initialX;
                currentY = e.touches[0].clientY - initialY;
            } else {
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
            }

            state.xOffset = currentX;
            state.yOffset = currentY;

            OpticalMediaGood.Utils.setTranslate(currentX, currentY, windowElement);
        }
    }

    addEventCompat(document, "mousedown", dragStart);
    addEventCompat(document, "touchstart", dragStart);
    addEventCompat(document, "mouseup", dragEnd);
    addEventCompat(document, "touchend", dragEnd);
    addEventCompat(document, "mousemove", drag);
    addEventCompat(document, "touchmove", drag);
};


OpticalMediaGood.WindowManager.Init.initializeWindowControls = function() {
    addEventCompat(document, 'click', function(e) {
        e = e || window.event;

        var target = e.target || e.srcElement;
        if (!target) return;

        var button = target.closest('.title-bar-controls button');
        if (!button) return;

        var titleBar = button.closest('.title-bar');
        var windowId = titleBar.id.replace(OpticalMediaGood.Suffixes.TITLEBAR, '');
        var windowElement = document.getElementById(windowId);
        var state = OpticalMediaGood.windowStates[windowId];

        stopPropagationCompat(e);

        if (hasClass(button, 'minimize-btn')) {
            windowElement.style.display = "none";
            state.isMinimized = true;

            var otherVisibleWindowId = null;
            var highestZIndex = 0;

            for (var i = 0; i < windows.length; i++) {
                var checkWindow = document.getElementById(windows[i].id);
                if (checkWindow && checkWindow.style.display !== 'none' && checkWindow.id !== windowId) {
                    var zIndex = parseInt(checkWindow.style.zIndex) || 1000;
                    if (zIndex > highestZIndex) {
                        highestZIndex = zIndex;
                        otherVisibleWindowId = windows[i].id;
                    }
                }
            }

            if (otherVisibleWindowId) {
                OpticalMediaGood.WindowManager.State.focusWindow(otherVisibleWindowId);
            } else {
                OpticalMediaGood.WindowManager.State.unfocusAllWindows();
            }

        } else if (hasClass(button, 'close-btn')) {
            windowElement.style.display = "none";
            state.isMinimized = false;

            var originalConfig = findInArray(windows, function(w) { return w.id === windowId; });
            if (originalConfig) {
                state.xOffset = originalConfig.initialX;
                state.yOffset = originalConfig.initialY;
                OpticalMediaGood.Utils.setTranslate(originalConfig.initialX, originalConfig.initialY, windowElement);
                originalConfig.active = false;
            }

            var otherVisibleWindowId = null;
            var highestZIndex = 0;

            for (var i = 0; i < windows.length; i++) {
                var checkWindow = document.getElementById(windows[i].id);
                if (checkWindow && checkWindow.style.display !== 'none' && checkWindow.id !== windowId) {
                    var zIndex = parseInt(checkWindow.style.zIndex) || 1000;
                    if (zIndex > highestZIndex) {
                        highestZIndex = zIndex;
                        otherVisibleWindowId = windows[i].id;
                    }
                }
            }

            if (otherVisibleWindowId) {
                OpticalMediaGood.WindowManager.State.focusWindow(otherVisibleWindowId);
            } else {
                OpticalMediaGood.WindowManager.State.unfocusAllWindows();
            }
        } else if (hasClass(button, 'maximize-btn') || hasClass(button, 'restore-btn')) {
            OpticalMediaGood.WindowManager.State.toggleMaximize(windowId, button);
        }
    });
};


OpticalMediaGood.WindowManager.Init.initializeTaskbar = function() {
    addEventCompat(document, 'click', function(e) {
        e = e || window.event;
        var target = e.target || e.srcElement;

        var tab = target.closest('.open-tab');
        if (!tab) return;

        var windowId = tab.id.replace(OpticalMediaGood.Suffixes.TAB, '');
        var windowElement = document.getElementById(windowId);
        var state = OpticalMediaGood.windowStates[windowId];

        stopPropagationCompat(e);

        if (windowElement.style.display === "none") {
            windowElement.style.display = "block";
            OpticalMediaGood.Utils.setTranslate(state.xOffset, state.yOffset, windowElement);
            OpticalMediaGood.WindowManager.State.focusWindow(windowId);
        } else if (hasClass(tab, 'active')) {
            windowElement.style.display = "none";
            state.isMinimized = true;
            OpticalMediaGood.WindowManager.State.updateAllTaskbarTabs();
        } else {
            OpticalMediaGood.WindowManager.State.focusWindow(windowId);
        }
    });
};
