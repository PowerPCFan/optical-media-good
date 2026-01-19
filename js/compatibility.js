function addEventCompat(element, event, handler) {
    if (element.addEventListener) {
        element.addEventListener(event, handler);
    } else if (element.attachEvent) {
        element.attachEvent('on' + event, handler);
    } else {
        element['on' + event] = handler;
    }
}


function querySelectorCompat(selector) {
    if (document.querySelector) {
        return document.querySelector(selector);
    }

    if (selector.charAt(0) === '#') {
        return document.getElementById(selector.substring(1));
    }

    if (selector.charAt(0) === '.') {
        var className = selector.substring(1);
        var elements = document.getElementsByTagName('*');
        for (var i = 0; i < elements.length; i++) {
            if (hasClass(elements[i], className)) {
                return elements[i];
            }
        }
    }

    if (selector.charAt(0) === '[') {
        var match = selector.match(/\[(.*?)="(.*?)"\]/);
        if (match) {
            var attrName = match[1];
            var attrValue = match[2];
            var elements = document.getElementsByTagName('*');
            for (var i = 0; i < elements.length; i++) {
                if (elements[i].getAttribute && elements[i].getAttribute(attrName) === attrValue) {
                    return elements[i];
                }
            }
        }
    }
    return null;
}


function querySelectorAllCompat(selector) {
    if (document.querySelectorAll) {
        return document.querySelectorAll(selector);
    }

    var results = [];
    if (selector.charAt(0) === '.') {
        var className = selector.substring(1);
        var elements = document.getElementsByTagName('*');
        for (var i = 0; i < elements.length; i++) {
            if (hasClass(elements[i], className)) {
                results.push(elements[i]);
            }
        }
    }
    return results;
}


function addClass(element, className) {
    if (!element) return;
    if (element.classList) {
        element.classList.add(className);
    } else {
        if (!hasClass(element, className)) {
            var currentClass = element.className || '';
            element.className = (currentClass ? currentClass + ' ' : '') + className;
        }
    }
}


function removeClass(element, className) {
    if (!element) return;
    if (element.classList) {
        element.classList.remove(className);
    } else {
        if (element.className) {
            var reg = new RegExp('(\\s|^)' + className + '(\\s|$)', 'g');
            element.className = element.className.replace(reg, ' ').replace(/\s+/g, ' ').replace(/^\s+|\s+$/g, '');
        }
    }
}


function hasClass(element, className) {
    if (element.classList) {
        return element.classList.contains(className);
    } else {
        return new RegExp('(\\s|^)' + className + '(\\s|$)').test(element.className);
    }
}


function forEachCompat(nodeList, callback) {
    if (nodeList.forEach) {
        nodeList.forEach(callback);
    } else {
        for (var i = 0; i < nodeList.length; i++) {
            callback(nodeList[i], i);
        }
    }
}


function setPositionCompat(element, x, y) {
    if (typeof element.style.transform !== 'undefined') {
        element.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
    } else if (typeof element.style.webkitTransform !== 'undefined') {
        element.style.webkitTransform = 'translate(' + x + 'px, ' + y + 'px)';
    } else if (typeof element.style.mozTransform !== 'undefined') {
        element.style.mozTransform = 'translate(' + x + 'px, ' + y + 'px)';
    } else if (typeof element.style.msTransform !== 'undefined') {
        element.style.msTransform = 'translate(' + x + 'px, ' + y + 'px)';
    } else {
        element.style.position = 'absolute';
        element.style.left = x + 'px';
        element.style.top = y + 'px';
    }
}


function preventDefaultCompat(event) {
    if (event.preventDefault) {
        event.preventDefault();
    } else {
        // IE
        event.returnValue = false;
    }
}


function stopPropagationCompat(event) {
    if (event.stopPropagation) {
        event.stopPropagation();
    } else {
        // IE
        event.cancelBubble = true;
    }
}


function getBoundingRectCompat(element) {
    if (element.getBoundingClientRect) {
        return element.getBoundingClientRect();
    } else {
        var left = 0, top = 0;
        var current = element;
        while (current) {
            left += current.offsetLeft || 0;
            top += current.offsetTop || 0;
            current = current.offsetParent;
        }
        return {
            left: left,
            top: top,
            right: left + (element.offsetWidth || 0),
            bottom: top + (element.offsetHeight || 0),
            width: element.offsetWidth || 0,
            height: element.offsetHeight || 0
        };
    }
}


function findInArray(array, callback) {
    if (array.find) {
        return array.find(callback);
    }
    for (var i = 0; i < array.length; i++) {
        if (callback(array[i], i, array)) {
            return array[i];
        }
    }
    return undefined;
}


function getClosestElement(element, selector) {
    if (element.closest) {
        return element.closest(selector);
    }

    while (element && element !== document) {
        if (selector.charAt(0) === '.' && hasClass(element, selector.substring(1))) {
            return element;
        }
        element = element.parentNode;
    }
    return null;
}


function containsElement(parent, child) {
    if (parent.contains) {
        return parent.contains(child);
    }

    while (child && child !== document) {
        if (child === parent) {
            return true;
        }
        child = child.parentNode;
    }
    return false;
}
