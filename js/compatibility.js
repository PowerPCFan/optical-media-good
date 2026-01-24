// Polyfill for Element.matches() and Element.closest()
// Source: https://unpkg.com/element-closest
!(function (e) {
    var t = e.Element.prototype;
    ("function" != typeof t.matches &&
        (t.matches =
            t.msMatchesSelector ||
            t.mozMatchesSelector ||
            t.webkitMatchesSelector ||
            function (e) {
                for (
                    var t = (this.document || this.ownerDocument).querySelectorAll(e),
                        o = 0;
                    t[o] && t[o] !== this;
                )
                    ++o;
                return Boolean(t[o]);
            }),
        "function" != typeof t.closest &&
            (t.closest = function (e) {
                for (var t = this; t && 1 === t.nodeType; ) {
                    if (t.matches(e)) return t;
                    t = t.parentNode;
                }
                return null;
            }));
})(window);


function addEventCompat(element, event, handler) {
    if (element.addEventListener) {
        element.addEventListener(event, handler, false);
    } else if (element.attachEvent) {
        element.attachEvent('on' + event, function() {
            var e = window.event;
            return handler.call(element, e);
        });
    } else {
        element['on' + event] = handler;
    }
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
    if (!element || !element.style || isNaN(x) || isNaN(y)) return;

    var transformValue = OpticalMediaGood.Supports3DTransform ? 'translate3d(' + x + 'px, ' + y + 'px, 0)' : 'translate(' + x + 'px, ' + y + 'px)';

    if (typeof element.style.transform !== 'undefined') {
        element.style.transform = transformValue;
    // } else if (typeof element.style.webkitTransform !== 'undefined') {
    //     element.style.webkitTransform = transformValue;
    // } else if (typeof element.style.mozTransform !== 'undefined') {
    //     element.style.mozTransform = transformValue;
    // } else if (typeof element.style.msTransform !== 'undefined') {
    //     element.style.msTransform = transformValue;
    } else {
        element.style.zoom = 1;
        element.style.position = 'absolute';
        element.style.left = x + 'px';
        element.style.top = y + 'px';
    }
}


function preventDefaultCompat(event) {
    event = event || window.event;

    if (event.preventDefault) {
        event.preventDefault();
    } else {
        // IE
        event.returnValue = false;
    }
}


function stopPropagationCompat(event) {
    event = event || window.event;

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


function getComputedStyleCompat(element) {
    if (window.getComputedStyle) {
        return window.getComputedStyle(element);
    } else {
        // Internet Explorer - normalize from camelCase to kebab-case since getComputedStyle uses kebab-case (CSS's property format)
        var style = element.currentStyle;
        var normalized = {};

        for (var prop in style) {
            try {
                var kebab = prop.replace(/([A-Z])/g, "-$1").toLowerCase();
                normalized[kebab] = style[prop];
            } catch (e) {
                // ignore errors
            }
        }

        normalized.getPropertyValue = function(property) {
            return this[property] || null;
        };

        return normalized;
    }
}
