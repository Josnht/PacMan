class FruitScoreAnimation extends Animation {

    constructor(canvas, text, pos) {
        super();

        this.canvas = canvas;
        this.text = text;
        this.pos = pos;
        this.blocksGame = true;
        this.endTime = 2400;
    }

    animate() {
        let color = "rgb(255, 184, 255)";
        if (this.time > 200 && this.time < 2400) {
            let alpha = this.time < 1000 ? 1 : 1 - Math.round((this.time - 1000) * 1.25) / 2000;
            color = "rgba(255, 184, 255, " + alpha + ")";
        }

        this.canvas.clear();
        this.canvas.drawText({
            size: 1,
            color: color,
            text: this.text,
            pos: {
                x: this.pos.x + 0.5,
                y: this.pos.y + 0.5
            }
        });

        if (this.time > 200) {
            this.blocksGame = false;
        }
    }
}