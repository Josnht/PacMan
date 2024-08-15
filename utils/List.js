var List = (function() {
    "use strict";



    function Node(data, prev, next) {
        this.data = data;
        this.prev = prev;
        this.next = next;
    }



    function Iterator(list, prev, next) {
        this.list = list;
        this.previows = prev;
        this.following = next;
    }

    Iterator.prototype.next = function() {
        if (this.hasNext()) {
            this.previows = this.following;
            this.following = this.following.next;
        }
    };


    Iterator.prototype.prev = function() {
        if (this.hasPrev()) {
            this.following = this.previows;
            this.previows = this.previows.prev;
        }
    };


    Iterator.prototype.hasNext = function() {
        return this.following !== null;
    };


    Iterator.prototype.hasPrev = function() {
        return this.previows !== null;
    };


    Iterator.prototype.getNext = function() {
        if (this.hasNext()) {
            return this.following.data;
        }
    };


    Iterator.prototype.getPrev = function() {
        if (this.hasPrev()) {
            return this.previows.data;
        }
    };


    Iterator.prototype.removeNext = function() {
        // Cant remove next if there isnt one
        if (!this.hasNext()) {
            return;
        }

        if (this.following.next) {
            this.following.next.prev = this.following.prev;
        } else {
            this.list.tail = this.following.prev;
        }

        if (this.following.prev) {
            this.following.prev.next = this.following.next;
        } else {
            this.list.head = this.following.next;
        }

        this.following = this.following.next;
        this.list.length -= 1;
    };


    Iterator.prototype.removePrev = function() {
        if (this.hasPrev()) {
            this.prev();
            this.removeNext();
        }
    };




    function List() {
        this.head = null;
        this.tail = null;
        this.length = 0;
    }


    List.prototype.add = function(item, prev, next) {
        var node = new Node(item, prev, next);

        if (this.head === null) {
            this.head = node;
            this.tail = node;
        } else if (prev) {
            this.tail.next = node;
            this.tail = node;
        } else if (next) {
            this.head.prev = node;
            this.head = node;
        }

        this.length += 1;
        return node;
    };


    List.prototype.addFirst = function(item) {
        this.add(item, null, this.head);
        return this.iterate();
    };


    List.prototype.addLast = function(item) {
        this.add(item, this.tail, null);
        return this.iterateLast();
    };



    List.prototype.first = function() {
        if (this.head) {
            return this.head.data;
        }
        return null;
    };

    List.prototype.last = function() {
        if (this.tail) {
            return this.tail.data;
        }
        return null;
    };



    List.prototype.isEmpty = function() {
        return this.head === null;
    };


    List.prototype.size = function() {
        return this.length;
    };


    List.prototype.iterate = function() {
        if (this.head) {
            return new Iterator(this, null, this.head);
        }
        return null;
    };


    List.prototype.iterateLast = function() {
        if (this.tail) {
            return new Iterator(this, this.tail, null);
        }
        return null;
    };



    List.prototype.forEach = function(callback) {
        if (this.head) {
            var it = this.iterate(),
                count = 0;
            while (it.hasNext()) {
                callback(it.getNext(), count);
                it.next();
                count += 1;
            }
        }
    };


    List.prototype.some = function(callback) {
        if (this.head) {
            var it = this.iterate(),
                count = 0;
            while (it.hasNext()) {
                if (callback(it.getNext(), count)) {
                    return true;
                }
                it.next();
                count += 1;
            }
        }
        return false;
    };


    return List;
}());