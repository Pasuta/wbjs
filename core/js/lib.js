function ajax(url, params) {
    return new Promise(function(resolve, reject) {
        var req = window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();
        if (!window.ActiveXObject && !window.XMLHttpRequest) alert('Download new browser, please!');
        req.open('POST', url);

        req.onload = function() {
            if (req.status == 200) {
                resolve(req.response);
            } else {
                reject(Error(req.statusText)); // TODO make error reporting
            }
        };

        req.onerror = function() {
            reject(Error("Network error"))
        };

        req.send(convertToString(params));
    }).then(convertToObject);
}

function convertToString(arr) {
    var string = "";
    for (var e in arr) {
        if(arr.hasOwnProperty(e)){
            string += "&" + e + "=" + encodeURIComponent(arr[e]);
        }
    }
    return string.substring(1);
}

function convertToObject(str) {
    var answer = {};
    str = str.split('&');
    str.forEach(function(e){
        e = e.split('=');
        answer[e[0]] = decodeURIComponent(e[1]);
    });
    return answer;
}

function jsonMergeRecursive(json1, json2) { // обьединение двух обьектов
    var out = {};
    for(var k1 in json1){
        if (json1.hasOwnProperty(k1)) out[k1] = json1[k1];
    }
    for(var k2 in json2){
        if (json2.hasOwnProperty(k2)) {
            if(!out.hasOwnProperty(k2)) out[k2] = json2[k2];
            else if(
                (typeof out[k2] === 'object') && (out[k2].constructor === Object) &&
                (typeof json2[k2] === 'object') && (json2[k2].constructor === Object)
            ) out[k2] = json_merge_recursive(out[k2], json2[k2]);
        }
    }
    return out;
}

function collectFormData(form){
    var m = {};

    var input = form.querySelectorAll('input');
    for (var i = 0; i < input.length; i++) {
        var obj = input[i];
        var relation = obj.getAttribute('data-relation');
        if(obj.getAttribute('type') == 'radio'){
            if(obj.checked) m[obj.name] = obj.value;
            continue;
        }
        if(!obj.value) continue;
        relation ?  m[relation] += '.' + obj.value : m[obj.name] = obj.value;
    }

    var textarea = form.querySelectorAll('textarea');
    for (var j = 0; j < textarea.length; j++) {
        var obj2 = textarea[j];
        if(!obj2.value) continue;
        m[obj2.name] = obj2.value;
    }

    return m;
}

Event = (function () {

    var guid = 0;

    function fixEvent(event) {
        event = event || window.event;

        if (event.isFixed) {
            return event
        }
        event.isFixed = true;

        event.preventDefault = event.preventDefault || function () {
            this.returnValue = false
        };
        event.stopPropagation = event.stopPropagaton || function () {
            this.cancelBubble = true
        };

        if (!event.target) {
            event.target = event.srcElement
        }

        if (!event.relatedTarget && event.fromElement) {
            event.relatedTarget = event.fromElement == event.target ? event.toElement : event.fromElement;
        }

        if (event.pageX == null && event.clientX != null) {
            var html = document.documentElement, body = document.body;
            event.pageX = event.clientX + (html && html.scrollLeft || body && body.scrollLeft || 0) - (html.clientLeft || 0);
            event.pageY = event.clientY + (html && html.scrollTop || body && body.scrollTop || 0) - (html.clientTop || 0);
        }

        if (!event.which && event.button) {
            event.which = (event.button & 1 ? 1 : ( event.button & 2 ? 3 : ( event.button & 4 ? 2 : 0 ) ));
        }

        return event
    }

    /* Вызывается в контексте элемента всегда this = element */
    function commonHandle(event) {
        event = fixEvent(event);

        var handlers = this.events[event.type];

        for (var g in handlers) {
            if(handlers.hasOwnProperty(g)){
                var handler = handlers[g];

                var ret = handler.call(this, event);
                if (ret === false) {
                    event.preventDefault();
                    event.stopPropagation()
                }
            }
        }
    }

    return {
        add:function (elem, type, handler) {
            if (!elem) {
                throw 'No domel provided for Event.add. May be early call before dom loaded';
            }
            if (elem.setInterval && ( elem != window && !elem.frameElement )) {
                elem = window;
            }

            if (!handler.guid) {
                handler.guid = ++guid
            }

            if (!elem.events) {
                elem.events = {};
                elem.handle = function (event) {
                    if (typeof Event !== "undefined") {
                        return commonHandle.call(elem, event)
                    }
                }
            }

            if (!elem.events[type]) {
                elem.events[type] = {};

                if (elem.addEventListener)
                    elem.addEventListener(type, elem.handle, false);
                else if (elem.attachEvent)
                    elem.attachEvent("on" + type, elem.handle)
            }

            elem.events[type][handler.guid] = handler
        },

        remove:function (elem, type, handler) {
            var handlers = elem.events && elem.events[type];

            if (!handlers) return;

            delete handlers[handler.guid];

            for (var any in handlers) return
            if (elem.removeEventListener)
                elem.removeEventListener(type, elem.handle, false);
            else if (elem.detachEvent)
                elem.detachEvent("on" + type, elem.handle);

            delete elem.events[type];


            for (var any in elem.events) return
            try {
                delete elem.handle;
                delete elem.events
            } catch (e) { // IE
                elem.removeAttribute("handle");
                elem.removeAttribute("events")
            }
        }
    }
}());

if (typeof exports == 'object') {
    exports.convertToString = convertToString;
    exports.convertToObject = convertToObject;
    exports.jsonMergeRecursive = jsonMergeRecursive;
}