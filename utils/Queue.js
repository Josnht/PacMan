var Queue = (function() {
    "use strict";


    function Queue() {
        this.head = null;
        this.tail = null;
        this.current = null;
        this.length = 0;
    }


    Queue.prototype.enqueue = function(item) {
        var node = {
            data: item,
            next: null
        };

        if (!this.head) {
            this.head = node;
            this.tail = node;
        } else {
            this.tail.next = node;
            this.tail = node;
        }
        this.length += 1;
    };

    Queue.prototype.dequeue = function() {
        if (this.head) {
            var aux = this.head;
            this.head = this.head.next;
            this.length -= 1;
            return aux.data;
        }
        return null;
    };


    Queue.prototype.first = function() {
        return this.head ? this.head.data : null;
    };


    Queue.prototype.last = function() {
        return this.tail ? this.tail.data : null;
    };



    Queue.prototype.isEmpty = function() {
        return !this.head;
    };


    Queue.prototype.size = function() {
        return this.length;
    };



    Queue.prototype.iterate = function() {
        this.current = this.head;
    };


    Queue.prototype.next = function() {
        if (this.current) {
            this.current = this.current.next;
        }
    };


    Queue.prototype.item = function() {
        return this.current ? this.current.data : null;
    };


    Queue.prototype.hasNext = function() {
        return !!this.current;
    };


    return Queue;
}());