/**
 * The Animation Base Class
 */
class Animation {

    /**
     * The Animation Base constructor
     */
    constructor() {
        this.time = 0;
    }

    /**
     * Increases the timer
     * @param {number} time
     */
    incTimer(time) {
        this.time += time;
    }

    /**
     * Returns true if the animation hasn't ended
     * 
     */
    isAnimating() {
        return this.endTime > this.time;
    }

    /**
     * Returns true if the game loop stops while the animation is running
     * 
     */
    blocksGameLoop() {
        return this.blocksGame;
    }

    /**
     * Does the Animation
     * 
     */
    animate() {
        return undefined;
    }

    /**
     * Called when the animation ends
     */
    onEnd() {
        if (this.canvas) {
            if (this.clearAll) {
                this.canvas.clear();
            } else {
                this.canvas.clearSavedRects();
            }
        }

        if (this.callback) {
            this.callback();
        }
    }
}