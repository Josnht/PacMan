var Storage = (function() {
    "use strict";


    function supportsStorage() {
        return window.localStorage !== "undefined" && window.localStorage !== null;
    }


    function isInteger(string) {
        var validChars = "0123456789-",
            isNumber = true,
            i, char;

        for (i = 0; i < string.length && isNumber === true; i += 1) {
            char = string.charAt(i);
            if (validChars.indexOf(char) === -1) {
                isNumber = false;
            }
        }
        return isNumber;
    }



    function Storage(name, single) {
        this.name = name;
        this.single = single || false;
        this.supports = supportsStorage();
    }


    Storage.prototype.get = function(name) {
        var content = null;

        if (this.supports && window.localStorage[this.getName(name)]) {
            content = window.localStorage[this.getName(name)];
            if (content === "true" || content === "false") {
                content = content === "true";
            } else if (isInteger(content)) {
                content = parseInt(content, 10);
            } else {
                content = JSON.parse(content);
            }
        }
        return content;
    };


    Storage.prototype.set = function(name, value) {
        if (this.supports) {
            if (this.single) {
                value = name;
                name = "";
            }
            window.localStorage[this.getName(name)] = JSON.stringify(value);
        }
    };


    Storage.prototype.remove = function(name) {
        if (this.supports) {
            window.localStorage.removeItem(this.getName(name));
        }
    };



    Storage.prototype.getName = function(name) {
        return this.name + (name ? "." + name : "");
    };


    Storage.prototype.isSupported = function() {
        return this.supports;
    };

    return Storage;
}());