class Score {

    constructor() {
        this.canvas = Board.boardCanvas;
        this.ctx = this.canvas.context;

        this.score = 0;
        this.level = 1;
        this.lives = 2;
        this.bonus = 0;
        this.ghosts = 0;

        this.textTop = 32.5;
        this.scoreLeft = 3.2;
        this.livesLeft = 16.3;
        this.scoreMargin = 0.5;
        this.scoreWidth = 7;
        this.scoreHeight = 2;
        this.scoreColor = "rgb(255, 255, 51)";
        this.fruitTile = { x: 26, y: 31.5 };

        this.pacmans = [new Scorepacman(0), new Scorepacman(1)];
        this.food = new Fruit();
    }


    draw() {
        this.drawTexts();
        this.drawScore();

        this.pacmans.forEach(function(pacman) {
            pacman.draw();
        });
        this.food.draw(this.fruitTile);
    }



    incScore(amount) {
        this.score += amount;
        if (this.score > Data.extraLife * Math.pow(10, this.bonus)) {
            if (this.lives < 4) {
                this.incLife(true);
            }
            this.bonus += 1;
        }
        this.drawScore();
    }


    incLife(isIncrease) {
        this.lives += isIncrease ? 1 : -1;

        if (isIncrease) {
            let pacman = new Scorepacman(this.lives - 1);
            this.pacmans.push(pacman);
            pacman.draw();
        } else if (this.pacmans.length) {
            let pacman = this.pacmans.pop();
            pacman.clear();
        }
    }



    newLevel() {
        this.level += 1;
        this.ghosts = 0;
        Data.level = this.level;
    }


    pill(value) {
        this.incScore(value * Data.pillMult);
    }


    fruit() {
        let score = Data.getLevelData("fruitScore");
        this.incScore(score);
        return score;
    }


    kill(amount) {
        var score = Data.getGhostScore(amount);
        this.incScore(score);

        if (amount === 4) {
            this.ghosts += 1;
            if (this.ghosts === 4) {
                this.incScore(Data.eyesBonus);
            }
        }
        return score;
    }


    died() {
        this.incLife(false);
        return this.lives >= 0;
    }


    drawTexts() {
        this.canvas.drawText({
            text: "Score",
            size: 1.8,
            pos: { x: this.scoreLeft, y: this.textTop }
        });
        this.canvas.drawText({
            text: "Lives",
            size: 1.8,
            pos: { x: this.livesLeft, y: this.textTop }
        });
    }


    drawScore() {
        let left = this.ctx.measureText("Score").width,
            margin = this.scoreMargin * Board.tileSize,
            top = this.textTop * Board.tileSize,
            width = this.scoreWidth * Board.tileSize + margin / 2,
            height = this.scoreHeight * Board.tileSize;

        this.ctx.save();
        this.ctx.fillStyle = this.scoreColor;
        this.ctx.textAlign = "left";
        this.ctx.font = "1.8em 'Whimsy TT'";
        this.ctx.clearRect(left + margin / 2, top - height / 2 - 2, width, height + 2);
        this.ctx.fillText(this.score, left + margin, top);
        this.ctx.restore();
    }



    getLevel() {
        return this.level;
    }


    getScore() {
        return this.score;
    }
}