class Canvas {


    init(name) {
        let canvas = document.querySelector("." + name);
        canvas.width = Board.width;
        canvas.height = Board.height;

        this.ctx = canvas.getContext("2d");
        this.ctx.font = "2em 'Whimsy TT'";
        this.ctx.fillStyle = "white";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";

        this.rects = [];

        return this;
    }


    get context() {
        return this.ctx;
    }

    /**
     * Fills the canvas with black at the given alpha value
     */
    fill(alpha, x, y, width, height) {
        this.ctx.save();
        this.ctx.fillStyle = "rgba(0, 0, 0, " + alpha + ")";
        this.ctx.fillRect(x || 0, y || 0, width || Board.width, height || Board.height);
        this.ctx.restore();
    }


    clear() {
        this.ctx.clearRect(0, 0, Board.width, Board.height);
        this.rects = [];
    }


    clearSavedRects() {
        this.rects.forEach((rect) => {
            this.ctx.clearRect(rect.x, rect.y, rect.width, rect.height);
            if (rect.alpha) {
                this.fill(rect.alpha, rect.x, rect.y, rect.width, rect.height);
            }
        });
        this.rects = [];
    }


    savePos(x, y) {
        this.rects.push({
            x: x - Board.eraseSize / 2,
            y: y - Board.eraseSize / 2,
            width: Board.eraseSize,
            height: Board.eraseSize
        });
    }


    saveRect(data) {
        this.rects.push(data);
    }


    drawText(data) {
        let metrics, width, height, mult = 0.5;

        this.ctx.save();
        if (data.size) {
            this.ctx.font = data.size + "em 'Whimsy TT'";
        }
        if (data.align) {
            this.ctx.textAlign = data.align;
            mult = data.align === "left" ? 1 : 0;
        }
        this.ctx.fillStyle = data.color;
        this.ctx.fillText(data.text, data.pos.x * Board.tileSize, data.pos.y * Board.tileSize);
        this.ctx.restore();

        metrics = this.ctx.measureText(data.text);
        width = metrics.width + Board.tileSize;
        height = data.size ? (data.size + 0.5) * Board.tileSize : 2.5 * Board.tileSize;

        this.saveRect({
            x: data.pos.x * Board.tileSize - mult * width,
            y: data.pos.y * Board.tileSize - height / 2,
            width: width,
            height: height,
            alpha: data.alpha || 0
        });
    }
}