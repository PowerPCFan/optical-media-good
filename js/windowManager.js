OpticalMediaGood.WindowManager.Renderer.createWindowHTML = function(windowConfig) {
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
};


OpticalMediaGood.WindowManager.Renderer.createTaskbarTabHTML = function(windowConfig) {
    return '' +
        '<div class="open-tab ' + (windowConfig.active ? 'active' : '') + '" data-window-id="' + windowConfig.id + '">' +
            '<img src="' + windowConfig.icon + '"> ' + windowConfig.taskbarText +
        '</div>';
};


OpticalMediaGood.WindowManager.State.focusWindow = function(windowId) {
    var allWindows = querySelectorAllCompat('.window');

    for (var i = 0; i < allWindows.length; i++) {
        var win = allWindows[i];

        if (win.id === windowId) {
            win.style.zIndex = 1000 + allWindows.length;
            removeClass(win, 'window-active');
            removeClass(win, 'window-inactive');
            addClass(win, 'window-active');
        } else {
            win.style.zIndex = 1000 + i;
            removeClass(win, 'window-active');
            addClass(win, 'window-inactive');
        }
    }

    // Update taskbar tabs - sync with window focus
    var taskbarContainer = document.getElementById('taskbar-tabs');
    if (taskbarContainer) {
        var allTabs = taskbarContainer.getElementsByTagName('div');
        for (var j = 0; j < allTabs.length; j++) {
            var tab = allTabs[j];
            if (hasClass(tab, 'open-tab')) {
                var tabWindowId = tab.getAttribute('data-window-id');
                if (tabWindowId === windowId) {
                    addClass(tab, 'active');
                } else {
                    removeClass(tab, 'active');
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
            var tabWindowId = tab.getAttribute('data-window-id');

            if (tabWindowId === activeWindowId) {
                addClass(tab, 'active');
            } else {
                removeClass(tab, 'active');
            }
        }
    }
};


OpticalMediaGood.WindowManager.State.updateAllTaskbarTabs = function() {
    // Find ALL visible windows and their z-indexes
    var visibleWindows = [];
    
    for (var i = 0; i < windows.length; i++) {
        var windowElement = document.getElementById(windows[i].id);
        if (windowElement && windowElement.style.display !== 'none') {
            var zIndex = parseInt(windowElement.style.zIndex) || 1000;
            visibleWindows.push({
                id: windows[i].id,
                zIndex: zIndex
            });
        }
    }
    
    // Sort by z-index to find the topmost window
    visibleWindows.sort(function(a, b) { return b.zIndex - a.zIndex; });
    
    // The topmost visible window should have active taskbar tab
    var activeWindowId = visibleWindows.length > 0 ? visibleWindows[0].id : null;
    
    // Update ALL taskbar tabs
    var taskbarContainer = document.getElementById('taskbar-tabs');
    if (!taskbarContainer) return;

    var allTabElements = taskbarContainer.getElementsByTagName('div');
    for (var j = 0; j < allTabElements.length; j++) {
        var tab = allTabElements[j];
        if (hasClass(tab, 'open-tab')) {
            var tabWindowId = tab.getAttribute('data-window-id');
            if (activeWindowId && tabWindowId === activeWindowId) {
                addClass(tab, 'active');
            } else {
                removeClass(tab, 'active');
            }
        }
    }
};


OpticalMediaGood.WindowManager.State.unfocusWindow = function(windowId) {
    var windowElement = document.getElementById(windowId);
    if (windowElement) {
        removeClass(windowElement, 'window-active');
        addClass(windowElement, 'window-inactive');
    }
};


OpticalMediaGood.WindowManager.State.unfocusAllWindows = function() {
    // Unfocus all windows
    var allWindows = querySelectorAllCompat('.window');
    for (var i = 0; i < allWindows.length; i++) {
        removeClass(allWindows[i], 'window-active');
        addClass(allWindows[i], 'window-inactive');
        allWindows[i].style.zIndex = 1000 + i;
    }

    // Unfocus all taskbar tabs - sync with window focus
    var taskbarContainer = document.getElementById('taskbar-tabs');
    if (taskbarContainer) {
        var allTabs = taskbarContainer.getElementsByTagName('div');
        for (var j = 0; j < allTabs.length; j++) {
            var tab = allTabs[j];
            if (hasClass(tab, 'open-tab')) {
                removeClass(tab, 'active');
            }
        }
    }
};


OpticalMediaGood.WindowManager.State.toggleMaximize = function(windowId) {
    var state = OpticalMediaGood.windowStates[windowId];
    var windowElement = document.getElementById(windowId);
    var taskbarTab = querySelectorCompat('[data-window-id="' + windowId + '"]');
    this.focusWindow(windowId);

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
        this.restoreWindow(windowId);
        state.xOffset = state.originalStyles.xOffset || 0;
        state.yOffset = state.originalStyles.yOffset || 0;
        addClass(taskbarTab, 'active');
    }
};


OpticalMediaGood.WindowManager.State.restoreWindow = function(windowId) {
    var state = OpticalMediaGood.windowStates[windowId];
    var windowElement = document.getElementById(windowId);

    for (var key in state.originalStyles) {
        if (key !== 'xOffset' && key !== 'yOffset') {
            windowElement.style[key] = state.originalStyles[key];
        }
    }
    state.isMaximized = false;
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
        var button = getClosestElement(e.target, '.title-bar-controls button');
        if (button) {
            return;
        }
        
        var windowElement = getClosestElement(e.target, '.window');
        var titleBar = getClosestElement(e.target, '.title-bar');
        
        if (titleBar) {
            var windowId = titleBar.getAttribute('data-window-id');
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

    function dragStart(e) {
        var titleBar = getClosestElement(e.target, '.title-bar');
        if (!titleBar) return;

        var windowId = titleBar.getAttribute('data-window-id');
        var windowElement = document.getElementById(windowId);
        var state = OpticalMediaGood.windowStates[windowId];

        var clientX, clientY;
        if (e.type === "touchstart") {
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
            var newWidth = parseInt(windowElement.style.width) || 700;
            var newX = clientX - (newWidth * clickPercentage);
            var newY = clientY - 15;

            OpticalMediaGood.WindowManager.State.restoreWindow(windowId);
            state.xOffset = newX;
            state.yOffset = newY;

            initialX = clientX - newX;
            initialY = clientY - newY;

            OpticalMediaGood.Utils.setTranslate(newX, newY, windowElement);
        }
        
        state.isDragging = true;
        currentDragWindow = windowId;
        addClass(windowElement, 'dragging');
        OpticalMediaGood.WindowManager.State.focusWindow(windowId);
    }

    function dragEnd() {
        if (currentDragWindow) {
            var state = OpticalMediaGood.windowStates[currentDragWindow];
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

        var state = OpticalMediaGood.windowStates[currentDragWindow];
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
        var button = getClosestElement(e.target, '.title-bar-controls button');
        if (!button) return;

        var titleBar = getClosestElement(button, '.title-bar');
        var windowId = titleBar.getAttribute('data-window-id');
        var windowElement = document.getElementById(windowId);
        var state = OpticalMediaGood.windowStates[windowId];

        e.stopPropagation();

        if (hasClass(button, 'minimize-btn')) {
            windowElement.style.display = "none";
            state.isMinimized = true;
            
            // Check if there are other visible windows
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

            // Check if there are other visible windows
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
                // Focus the previously focused window
                // TODO: implement proper "last focused" tracking instead of just highest z-index
                OpticalMediaGood.WindowManager.State.focusWindow(otherVisibleWindowId);
            } else {
                // No other windows open, unfocus everything
                OpticalMediaGood.WindowManager.State.unfocusAllWindows();
            }
        } else if (hasClass(button, 'maximize-btn')) {
            OpticalMediaGood.WindowManager.State.toggleMaximize(windowId);
        }
    });
};


OpticalMediaGood.WindowManager.Init.initializeTaskbar = function() {
    addEventCompat(document, 'click', function(e) {
        var tab = getClosestElement(e.target, '.open-tab');
        if (!tab) return;

        var windowId = tab.getAttribute('data-window-id');
        var windowElement = document.getElementById(windowId);
        var state = OpticalMediaGood.windowStates[windowId];

        e.stopPropagation();
        
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