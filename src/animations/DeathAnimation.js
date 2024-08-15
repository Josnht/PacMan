class DeathAnimation extends Animation {


    constructor(canvas, blob, callback) {
        super();

        this.canvas = canvas;
        this.ctx = canvas.context;
        this.blob = blob;
        this.callback = callback;
        this.blocksGame = true;
        this.endTime = 1350;
        this.x = blob.getX();
        this.y = blob.getY();
    }


    animate() {
        let count = Math.round(this.time / 15);

        this.canvas.clearSavedRects();
        this.ctx.save();
        this.ctx.translate(this.x, this.y);

        if (this.time < 750) {
            this.blob.drawDeath(this.ctx, count);
        } else if (this.time < 1050) {
            this.blob.drawCircle(this.ctx, count - 50);
        } else {
            this.blob.drawCircle(this.ctx, count - 70);
        }

        this.ctx.restore();
        this.canvas.savePos(this.x, this.y);
    }
}