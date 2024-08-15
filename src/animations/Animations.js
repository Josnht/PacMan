class Animation {

    /**
     * The Animation Base constructor
     */
    constructor() {
        this.time = 0;
    }

    incTimer(time) {
        this.time += time;
    }


    isAnimating() {
        return this.endTime > this.time;
    }


    blocksGameLoop() {
        return this.blocksGame;
    }


    animate() {
        return undefined;
    }

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


class AnimationsManaging {


    constructor() {
        this.canvas = Board.screenCanvas;
        this.animations = [];
    }


    isAnimating() {
        return this.animations.length &&
            this.animations.some((anim) => anim.blocksGameLoop());
    }


    animate(time) {
        if (this.animations.length) {
            this.animations.forEach((animation, index, object) => {
                animation.incTimer(time);
                if (animation.isAnimating()) {
                    animation.animate();
                } else {
                    animation.onEnd();
                    object.splice(index, 1);
                }
            });
        }
    }


    endAll() {
        this.animations.forEach((anim) => anim.onEnd());
        this.animations = [];
    }


    add(animation) {
        this.animations.push(animation);
    }




    ready(callback) {
        this.add(new ReadyAnimation(this.canvas, callback));
    }


    paused() {
        this.add(new PausedAnimation(this.canvas));
    }


    death(pacman, callback) {
        this.add(new DeathAnimation(this.canvas, pacman, callback));
    }


    gameOver(callback) {
        this.add(new GameOverAnimation(this.canvas, callback));
    }


    ghostScore(score, pos) {
        this.add(new GhostScoreAnimation(this.canvas, score, pos));
    }

    fruitScore(score, pos) {
        this.add(new FruitScoreAnimation(this.canvas, score, pos));
    }


    endLevel(callback) {
        this.add(new EndLevelAnimation(callback));
    }


    newLevel(level, callback) {
        this.add(new NewLevelAnimation(this.canvas, level, callback));
    }
}