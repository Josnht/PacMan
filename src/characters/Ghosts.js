class Ghost {


    init(canvas, dots) {
        this.canvas = canvas;
        this.ctx = canvas.context;

        this.mode = "scatter";
        this.tile = Board.getGhostStartTile(this.inPen);
        this.tileCenter = Board.getTileXYCenter(this.tile);
        this.turn = Board.getGhostStartTurn(this.inPen);
        this.center = false;
        this.dotsCount = dots || 0;
        this.target = this.scatter;
        this.speed = Data.getGhostSpeed(this.inPen);
        this.feet = 0;
        this.path = null;
        this.pathName = null;
        this.pathStep = 0;
    }

    switchMode(oldMode, newMode, pacman) {
        if (!this.dontSwitch(oldMode)) {
            this.mode = newMode;
            this.target = this.getTarget(pacman);
            this.speed = this.getSpeed();

            if (!this.dontHalfTurn(oldMode)) {
                if (this.path === null) {
                    this.turn = {
                        x: this.dir.x * -1,
                        y: this.dir.y * -1
                    };
                } else {
                    this.turn = { x: 1, y: 0 };
                }
            }
        }
    }


    move(speed, pacman, switchMode) {
        let addToPen = false;
        this.x += this.dir.x * this.speed * speed;
        this.y += this.dir.y * this.speed * speed;

        if (this.path !== null) {
            addToPen = this.pathMove(pacman, switchMode);
        } else {
            this.normalMove(pacman);
        }

        this.moveFeet();
        this.draw();
        return addToPen;
    }
    pathMove(pacman, switchMode) {
        let step = this.path[this.pathStep];
        if (this.passedDist()) {
            if (this.dir.x) {
                this.x = step.distx;
            }
            if (this.dir.y) {
                this.y = step.disty;
            }

            if (step.next !== null) {
                this.pathStep = step.next;
                this.dir = this.path[this.pathStep].dir;

            } else if (this.pathName === "exitPen") {
                this.path = null;
                this.dir = this.turn;
                this.turn = null;
                this.speed = Data.getGhostSpeed(false);

            } else if (this.pathName === "enterPen") {
                this.mode = switchMode;
                this.target = this.getTarget(pacman);
                this.tile = Board.getGhostStartTile(false);
                this.tileCenter = Board.getTileXYCenter(this.tile);
                this.turn = Board.getGhostStartTurn(true);
                return true;
            }
        }
        return false;
    }
    normalMove(pacman) {
        this.newTile(pacman);
        this.x = Board.tunnelEnds(this.x);

        if (!this.center && this.passedCenter()) {
            if (this.turn) {
                this.makeTurn();
            }
            if (this.isNextIntersection()) {
                this.decideTurn();
            }
            this.speed = this.getSpeed();
            this.center = true;
        }
    }

    newTile(pacman) {
        var tile = Board.getTilePos(this.x, this.y);
        if (!Board.equalTiles(this.tile, tile)) {
            this.tile = tile;
            this.tileCenter = Board.getTileXYCenter(this.tile);
            this.center = false;

            if (this.isEnteringPen()) {
                this.setPath("enterPen");
            }
        }
    }

    setPath(name) {
        this.pathName = name;
        this.pathStep = 0;
        this.path = this.paths[this.pathName];
        this.dir = this.path[this.pathStep].dir;
        this.speed = Data.getPathSpeed(name);
    }

    isEnteringPen() {
        return this.mode === "eyes" && Board.equalTiles(this.tile, Board.eyesTarget);
    }

    makeTurn() {
        this.x = this.tileCenter.x;
        this.y = this.tileCenter.y;
        this.dir = this.turn;
        this.turn = null;
    }


    decideTurn() {
        let turns = this.getTurns();
        if (turns.length === 1) {
            this.turn = turns[0];
        } else if (Data.isFrighten(this.mode)) {
            this.turn = turns[Utils.rand(0, turns.length - 1)];
        } else {
            this.turn = this.getTargetTurn(turns);
        }
    }

    getTurns() {
        let tile = this.getNextTile(),
            pos = Board.tileToString(tile),
            turns = Board.getTurns(pos),
            result = [];

        turns.forEach((turn) => {
            if ((turn + 2) % 4 !== Board.dirToNumber(this.dir)) {
                result.push(Board.numberToDir(turn));
            }
        });
        return result;
    }


    getTargetTurn(turns) {
        let tile = this.getNextTile(),
            best = 999999,
            result = {};

        turns.forEach((turn) => {
            let ntile = Board.sumTiles(tile, turn),
                distx = Math.pow(this.target.x - ntile.x, 2),
                disty = Math.pow(this.target.y - ntile.y, 2),
                dist = Math.sqrt(distx + disty);

            if (dist < best) {
                best = dist;
                result = turn;
            }
        });
        return result;
    }


    killOrDie(pacmanTile) {
        if (Board.equalTiles(this.tile, pacmanTile) && !this.path) {
            if (Data.isFrighten(this.mode)) {
                this.mode = "eyes";
                this.target = Board.eyesTarget;
                this.speed = Data.eyesSpeed;
                return "kill";

            } else if (this.mode !== "eyes") {
                return "die";
            }
        }
    }


    shouldChangeTarget(globalMode) {
        return this.mode !== "eyes" && (globalMode === "chase" || this.isElroy());
    }


    dontSwitch(mode) {
        return (Data.isFrighten(mode) && !Data.isFrighten(this.mode)) || this.mode === "eyes";
    }


    dontHalfTurn(mode) {
        return mode === "blue" || mode === "white";
    }

    getSpeed() {
        let speed = Data.getGhostSpeed(false);

        if (this.mode === "eyes") {
            speed = Data.eyesSpeed;
        } else if (Data.isFrighten(this.mode)) {
            speed = Data.getLevelData("ghostFrightSpeed");
        } else if (Board.isTunnel(this.tile.x, this.tile.y)) {
            speed = Data.getLevelData("tunnelSpeed");
        } else if (this.isElroy()) {
            speed = Data.getLevelData("elroySpeed" + this.elroyMode);
        }
        return speed;
    }


    passedDist() {
        let path = this.path[this.pathStep];
        return (
            (this.dir.x === 1 && this.x >= path.distx) ||
            (this.dir.x === -1 && this.x <= path.distx) ||
            (this.dir.y === 1 && this.y >= path.disty) ||
            (this.dir.y === -1 && this.y <= path.disty)
        );
    }

    passedCenter() {
        return (
            (this.dir.x === 1 && this.x >= this.tileCenter.x) ||
            (this.dir.x === -1 && this.x <= this.tileCenter.x) ||
            (this.dir.y === 1 && this.y >= this.tileCenter.y) ||
            (this.dir.y === -1 && this.y <= this.tileCenter.y)
        );
    }


    getNextTile() {
        return Board.sumTiles(this.tile, this.dir);
    }


    isNextIntersection() {
        let tile = this.getNextTile();
        return Board.isIntersection(tile.x, tile.y);
    }


    getTarget(pacman) {
        if (this.mode === "chase" || this.isElroy()) {
            return this.chase(pacman);
        }
        return this.scatter;
    }



    isElroy() {
        return false;
    }


    activateElroy() {
        return undefined;
    }

    increaseDots() {
        this.dotsCount += 1;
    }


    setChaseTarget(pacman) {
        this.target = this.chase(pacman);
    }


    moveFeet() {
        this.feet = (this.feet + 0.3) % 2;
    }

    draw() {
        let center = Board.ghostSize / 2;
        this.canvas.savePos(this.x, this.y);
        this.ctx.save();
        this.ctx.translate(Math.round(this.x) - center, Math.round(this.y) - center);

        this.ghostBody();
        if (Data.isFrighten(this.mode)) {
            this.ghostFrightenFace();
        } else {
            this.ghostNormalFace();
        }
        this.ctx.restore();
    }


    ghostBody() {
        this.ctx.fillStyle = this.getBodyColor();
        this.ctx.beginPath();
        this.ctx.arc(8, 8, 8, Math.PI, 1.5 * Math.PI, false);
        this.ctx.arc(10, 8, 8, 1.5 * Math.PI, 2 * Math.PI, false);

        if (!Math.floor(this.feet)) {
            this.ghostFeet0();
        } else {
            this.ghostFeet1();
        }
        this.ctx.fill();
    }


    ghostFeet0() {
        this.ctx.lineTo(18, 16);
        this.ctx.lineTo(16, 18);
        this.ctx.lineTo(15, 18);
        this.ctx.lineTo(12, 15);
        this.ctx.lineTo(9, 18);
        this.ctx.lineTo(6, 15);
        this.ctx.lineTo(3, 18);
        this.ctx.lineTo(2, 18);
        this.ctx.lineTo(0, 16);
        this.ctx.lineTo(0, 8);
    }

    ghostFeet1() {
        this.ctx.lineTo(18, 18);
        this.ctx.lineTo(15, 15);
        this.ctx.lineTo(12, 18);
        this.ctx.lineTo(11, 18);
        this.ctx.lineTo(9, 15);
        this.ctx.lineTo(7, 18);
        this.ctx.lineTo(6, 18);
        this.ctx.lineTo(3, 15);
        this.ctx.lineTo(0, 18);
        this.ctx.lineTo(0, 8);
    }


    ghostNormalFace() {
        this.ctx.fillStyle = "rgb(255, 255, 255)";
        this.ctx.beginPath();
        this.ctx.arc(6 + this.dir.x * 2, 7 + this.dir.y * 2, 3, 0, 2 * Math.PI);
        this.ctx.arc(12.5 + this.dir.x * 2, 7 + this.dir.y * 2, 3, 0, 2 * Math.PI);
        this.ctx.fill();

        this.ctx.fillStyle = "rgb(0, 51, 255)";
        this.ctx.beginPath();
        this.ctx.arc(6 + this.dir.x * 4, 7 + this.dir.y * 4, 1.5, 0, 2 * Math.PI);
        this.ctx.arc(12.5 + this.dir.x * 4, 7 + this.dir.y * 4, 1.5, 0, 2 * Math.PI);
        this.ctx.fill();
    }


    ghostFrightenFace() {
        this.ctx.fillStyle = this.getFaceColor();
        this.ctx.beginPath();
        this.ctx.arc(6, 7, 1.5, 0, 2 * Math.PI);
        this.ctx.arc(12.5, 7, 1.5, 0, 2 * Math.PI);
        this.ctx.fill();

        this.ctx.strokeStyle = this.getFaceColor();
        this.ctx.beginPath();
        this.ctx.moveTo(3, 14);
        this.ctx.lineTo(5, 11);
        this.ctx.lineTo(7, 14);
        this.ctx.lineTo(9, 11);
        this.ctx.lineTo(11, 14);
        this.ctx.lineTo(13, 11);
        this.ctx.lineTo(15, 14);
        this.ctx.stroke();
    }

    getBodyColor() {
        switch (this.mode) {
            case "blue":
                return "rgb(0, 51, 255)";
            case "white":
                return "rgb(255, 255, 255)";
            case "eyes":
                return "rgb(0, 0, 0)";
            default:
                return this.color;
        }
    }


    getFaceColor() {
        return this.mode === "blue" ? "rgb(255, 255, 255)" : "rgb(255, 0, 0)";
    }



    getID() {
        return this.id;
    }


    getXPos() {
        return this.x;
    }


    getYPos() {
        return this.y;
    }

    getTile() {
        return this.tile;
    }


    getDots() {
        return this.dotsCount;
    }


    getTargetTile() {
        return this.target;
    }
}

class GhostsManaging {


    constructor(oldManager) {
        // Ghosts Data
        this.globalMode = "scatter";
        this.modeCounter = 0;
        this.modeTimer = Data.getSwitchTime(0);
        this.frightTimer = 0;
        this.blinksCount = 0;
        this.eyesCounter = 0;

        // The Ghosts
        var canvas = Board.gameCanvas;
        this.blinky = new Blinky(canvas, oldManager ? oldManager.blinky.getDots() : null);
        this.pinky = new Pinky(canvas, oldManager ? oldManager.pinky.getDots() : null);
        this.inky = new Inky(canvas, oldManager ? oldManager.inky.getDots() : null, this.blinky);
        this.clyde = new Clyde(canvas, oldManager ? oldManager.clyde.getDots() : null);
        this.ghosts = [this.blinky, this.pinky, this.inky, this.clyde];

        // Pen Data
        this.penType = !!oldManager; // Type used to force ghosts out of the pen (false = using
        // ghost's dot counters
        this.penTimer = 0; // Pen Leaving Force Timer
        this.globalDots = 0; // Global dots counter
        this.inPen = [this.pinky, this.inky, this.clyde];

        if (!this.penType) {
            this.inPen.forEach(() => this.checkDotLimit());
        }
    }



    animate(time, speed, pacman) {
        if (this.frightTimer > 0) {
            this.frightTimer -= time;
        } else if (this.modeCounter < Data.totalSwitchs && this.modeTimer > 0) {
            this.modeTimer -= time;
        }

        this.switchMode(pacman);
        this.move(speed, pacman);
        this.increasePenTimer(time);
    }


    switchMode(pacman) {
        let oldMode = this.globalMode;
        if (Data.isFrighten(this.globalMode) && this.frightTimer <= 0) {
            this.blinksCount -= 1;

            if (this.blinksCount >= 0) {
                this.frightTimer = Data.blinksTimer;
                this.globalMode = this.globalMode === "white" ? "blue" : "white";
            } else {
                this.globalMode = this.getSwitchMode();
            }
            this.switchGhostsMode(oldMode, pacman);

        } else if (this.modeTimer <= 0) {
            this.modeCounter += 1;
            this.globalMode = this.getSwitchMode();
            this.modeTimer = Data.getSwitchTime(this.modeCounter);
            this.switchGhostsMode(oldMode, pacman);
        }
    }


    switchGhostsMode(oldMode, pacman) {
        this.ghosts.forEach((ghost) => {
            ghost.switchMode(oldMode, this.globalMode, pacman);
        });
    }


    move(speed, pacman) {
        let mode = this.getSwitchMode();
        this.ghosts.forEach((ghost) => {
            if (ghost.move(speed, pacman, mode)) {
                this.addGhostToPen(ghost);
            }
        });
    }


    draw() {
        this.ghosts.forEach((ghost) => ghost.draw());
    }

    setTargets(pacman) {
        this.ghosts.forEach((ghost) => {
            if (ghost.shouldChangeTarget(this.globalMode)) {
                ghost.setChaseTarget(pacman, this.blinky);
            }
        });
    }


    checkElroyDots(dots) {
        this.blinky.checkElroyDots(dots);
    }

    frighten(pacman) {
        var oldMode = this.globalMode;
        this.globalMode = "blue";
        this.frightTimer = Data.getFrightTime();
        this.blinksCount = Data.getBlinks();
        this.eyesCounter = 0;

        this.switchGhostsMode(oldMode, pacman);
    }


    crash(pacmanTile, onKill, onDie) {
        this.ghosts.some((ghost) => {
            let result = ghost.killOrDie(PacManTile);
            if (result === "kill") {
                this.eyesCounter += 1;
                onKill(this.eyesCounter, ghost.getTile());
            } else if (result === "die") {
                onDie();
            }
            return !!result;
        });
    }


    getSwitchMode() {
        return this.modeCounter % 2 === 0 ? "scatter" : "chase";
    }


    getMode() {
        return this.globalMode;
    }


    areFrighten() {
        return Data.isFrighten(this.globalMode);
    }



    incDotCounter() {
        if (!this.penType) {
            this.incGhostsDots();
        } else {
            this.incGlobalDots();
        }
    }


    incGhostsDots() {
        if (this.inPen.length > 0) {
            this.inPen[0].increaseDots();
            this.checkDotLimit();
        }
    }


    checkDotLimit() {
        let limits = Data.getLevelData("penLeavingLimit"),
            ghost = this.inPen[0];

        if (limits[ghost.getID()] <= ghost.getDots()) {
            this.releaseGhostFromPen();
        }
    }


    incGlobalDots() {
        this.globalDots += 1;

        this.inPen.forEach((ghost) => {
            if (this.globalDots === Data.getPenDotsCount(ghost.getID())) {
                if (ghost.getID() <= 2) {
                    this.releaseGhostFromPen();
                } else {
                    this.penType = false;
                    this.globalDots = 0;
                }
            }
        });
    }


    increasePenTimer(time) {
        this.penTimer += time;
        if (this.inPen.length > 0 && this.penTimer >= Data.getPenForceTime()) {
            this.releaseGhostFromPen();
            this.penTimer = 0;
        }
    }


    resetPenTimer() {
        this.penTimer = 0;
        this.incDotCounter();
    }


    releaseGhostFromPen() {
        let ghost = this.inPen[0];
        ghost.setPath("exitPen");
        ghost.activateElroy();

        this.inPen = this.inPen.slice(1);
    }


    addGhostToPen(ghost) {
        // Blinky never stays in the Pen
        if (ghost.getID() === 0) {
            ghost.setPath("exitPen");
        } else {
            let i = 0;
            while (i < this.inPen.length && this.inPen[i].getID() <= ghost.getID()) {
                i += 1;
            }
            this.inPen.splice(i, 0, ghost);
            ghost.setPath("inPen");

            if (!this.penType) {
                this.checkDotLimit();
            }
        }
    }
}