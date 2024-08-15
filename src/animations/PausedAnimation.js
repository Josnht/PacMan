class PausedAnimation extends Animation {

    constructor(canvas) {
        super();

        this.canvas = canvas;
        this.blocksGame = true;
        this.timePart = 500;
        this.partDiv = 5;
        this.maxSize = 2.2;
        this.minSize = 1.5;
        this.clearAll = true;
    }

    isAnimating() {
        return true;
    }


    PausedText() {
        let time = this.time % this.timePart,
            anim = Math.floor(this.time / this.timePart) % 2,
            part = time * (this.maxSize - this.minSize) / this.timePart,
            size = anim ? this.maxSize - part : this.minSize + part;

        this.canvas.clear();
        this.canvas.fill(0.8);

        this.canvas.drawText({
            size: size,
            color: "rgb(255, 255, 51)",
            text: "Paused!",
            pos: { x: 14, y: 17.3 },
            alpha: 0.8
        });
    }
}