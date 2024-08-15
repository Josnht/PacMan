let Board = (function() {
    "use strict";


    const wallValue = 0,
        pillPathValue = 2,
        interValue = 3,
        interPillValue = 4,
        tunnelValue = 5,

        boardMatrix = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 4, 2, 2, 2, 2, 4, 2, 2, 2, 2, 2, 4, 0, 0, 4, 2, 2, 2, 2, 2, 4, 2, 2, 2, 2, 4, 0],
            [0, 2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0],
            [0, 1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1, 0],
            [0, 2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0],
            [0, 4, 2, 2, 2, 2, 4, 2, 2, 4, 2, 2, 4, 2, 2, 4, 2, 2, 4, 2, 2, 4, 2, 2, 2, 2, 4, 0],
            [0, 2, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 2, 0],
            [0, 2, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 2, 0],
            [0, 4, 2, 2, 2, 2, 4, 0, 0, 4, 2, 2, 4, 0, 0, 4, 2, 2, 4, 0, 0, 4, 2, 2, 2, 2, 4, 0],
            [0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 2, 0, 0, 3, 1, 1, 3, 1, 1, 3, 1, 1, 3, 0, 0, 2, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 0, 0, 0],
            [5, 5, 5, 5, 5, 5, 4, 1, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 1, 4, 5, 5, 5, 5, 5, 5],
            [0, 0, 0, 0, 0, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 2, 0, 0, 3, 1, 1, 1, 1, 1, 1, 1, 1, 3, 0, 0, 2, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 0, 0, 0],
            [0, 4, 2, 2, 2, 2, 4, 2, 2, 4, 2, 2, 4, 0, 0, 4, 2, 2, 4, 2, 2, 4, 2, 2, 2, 2, 4, 0],
            [0, 2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0],
            [0, 2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0],
            [0, 3, 2, 4, 0, 0, 4, 2, 2, 4, 2, 2, 4, 1, 1, 4, 2, 2, 4, 2, 2, 4, 0, 0, 4, 2, 3, 0],
            [0, 0, 0, 2, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 2, 0, 0, 0],
            [0, 0, 0, 2, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 2, 0, 0, 0],
            [0, 4, 2, 4, 2, 2, 4, 0, 0, 4, 2, 2, 4, 0, 0, 4, 2, 2, 4, 0, 0, 4, 2, 2, 4, 2, 4, 0],
            [0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0],
            [0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0],
            [0, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 2, 2, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ],

        /**
         * Turn Position when at the Intersections
         * 0 Up | 1 Left | 2 Down | 3 Right
         */
        boardTurns = {
            x1y1: [2, 3],
            x6y1: [1, 2, 3],
            x12y1: [1, 2],
            x15y1: [2, 3],
            x21y1: [1, 2, 3],
            x26y1: [1, 2],
            x1y5: [0, 2, 3],
            x6y5: [0, 1, 2, 3],
            x9y5: [1, 2, 3],
            x12y5: [0, 1, 3],
            x15y5: [0, 1, 3],
            x18y5: [1, 2, 3],
            x21y5: [0, 1, 2, 3],
            x26y5: [0, 1, 2],
            x1y8: [0, 3],
            x6y8: [0, 1, 2],
            x9y8: [0, 3],
            x12y8: [1, 2],
            x15y8: [2, 3],
            x18y8: [0, 1],
            x21y8: [0, 2, 3],
            x26y8: [0, 1],
            x9y11: [2, 3],
            x12y11: [1, 3],
            x15y11: [1, 3],
            x18y11: [1, 2],
            x6y14: [0, 1, 2, 3],
            x9y14: [0, 1, 2],
            x18y14: [0, 2, 3],
            x21y14: [0, 1, 2, 3],
            x9y17: [0, 2, 3],
            x18y17: [0, 1, 2],
            x1y20: [2, 3],
            x6y20: [0, 1, 2, 3],
            x9y20: [0, 1, 3],
            x12y20: [1, 2],
            x15y20: [2, 3],
            x18y20: [0, 1, 3],
            x21y20: [0, 1, 2, 3],
            x26y20: [1, 2],
            x1y23: [0, 3],
            x3y23: [1, 2],
            x6y23: [0, 2, 3],
            x9y23: [1, 2, 3],
            x12y23: [1, 3],
            x15y23: [1, 3],
            x18y23: [1, 2, 3],
            x21y23: [0, 1, 2],
            x24y23: [2, 3],
            x26y23: [0, 1],
            x1y26: [2, 3],
            x3y26: [0, 1, 3],
            x6y26: [0, 1],
            x9y26: [0, 3],
            x12y26: [1, 2],
            x15y26: [2, 3],
            x18y26: [0, 1],
            x21y26: [0, 3],
            x24y26: [0, 1, 3],
            x26y26: [1, 2],
            x1y29: [0, 3],
            x12y29: [0, 1, 3],
            x15y29: [0, 1, 3],
            x26y29: [0, 1]
        },

        /** Board data */
        energizers = [{ x: 1, y: 3 }, { x: 26, y: 3 }, { x: 1, y: 23 }, { x: 26, y: 23 }],
        pillAmount = 244,
        fruitTile = { x: 13.25, y: 16.8333 },
        fruitSize = 20,
        tileSize = 12,
        lineWidth = 2,
        halfLine = lineWidth / 2,
        bigRadius = tileSize / 2,
        smallRadius = tileSize / 4,
        eraseSize = tileSize * 2,
        boardCols = boardMatrix[0].length,
        boardRows = boardMatrix.length,
        canvasWidth = tileSize * boardCols,
        canvasHeight = tileSize * boardRows,
        scoreHeight = tileSize * 2,
        totalHeight = canvasHeight + scoreHeight,
        tunnelStart = -tileSize / 2,
        tunnelEnd = tileSize * boardCols + tunnelStart,
        ghostSize = tileSize * 1.5,
        pacmanRadius = Math.round(tileSize / 1.5),
        pillSize = Math.round(tileSize * 0.16666),
        energizerSize = Math.round(tileSize * 0.41666),
        boardColor = "rgb(0, 51, 255)",
        startingPos = { x: 14, y: 23 },
        startingDir = { x: -1, y: 0 },
        eyesTarget = { x: 13, y: 11 };

    /**Game Canvas */
    let boardCanvas, screenCanvas, gameCanvas;



    function getTileCenter(tile) {
        return Math.round((tile + 0.5) * tileSize);
    }


    function tileToPos(tile) {
        return { x: tile.x * tileSize, y: tile.y * tileSize };
    }



    /**
     * The Board 
     */
    return {
        create() {
            boardCanvas = new BoardCanvas();
            screenCanvas = new Canvas().init("screen");
            gameCanvas = new GameCanvas();
        },


        get boardCanvas() {
            return boardCanvas;
        },


        get screenCanvas() {
            return screenCanvas;
        },


        get gameCanvas() {
            return gameCanvas;
        },




        clearGame() {
            gameCanvas.clearSavedRects();
        },


        drawBoard(newLevel) {
            boardCanvas.drawBoard(newLevel);
        },


        clearAll() {
            boardCanvas.clear();
            gameCanvas.clear();
            screenCanvas.clear();
        },



        get canvaswidth() {
            return canvasWidth;
        },


        get canvasheight() {
            return totalHeight;
        },


        get cols() {
            return boardCols;
        },


        get rows() {
            return boardRows;
        },


        get tileSize() {
            return tileSize;
        },


        get lineWidth() {
            return lineWidth;
        },


        get halfLine() {
            return halfLine;
        },


        get bigRadius() {
            return bigRadius;
        },


        get smallRadius() {
            return smallRadius;
        },


        get eraseSize() {
            return eraseSize;
        },

        get boardColor() {
            return boardColor;
        },


        get energizers() {
            return energizers;
        },


        get pillAmount() {
            return pillAmount;
        },


        get fruitTile() {
            return fruitTile;
        },


        get fruitPos() {
            return tileToPos(fruitTile);
        },


        get fruitSize() {
            return fruitSize;
        },


        get pillSize() {
            return pillSize;
        },


        get energizerSize() {
            return energizerSize;
        },


        get ghostSize() {
            return ghostSize;
        },


        get pacmanRadius() {
            return pacmanRadius;
        },

        get startingPos() {
            return { x: startingPos.x, y: startingPos.y };
        },


        get startingDir() {
            return { x: startingDir.x, y: startingDir.y };
        },



        get eyesTarget() {
            return eyesTarget;
        },



        getGhostStartTile(inPen) {
            return inPen ? { x: 13, y: 14 } : { x: 13, y: 11 };
        },


        getGhostStartTurn(inPen) {
            return inPen ? { x: -1, y: 0 } : null;
        },






        getPillRect(x, y) {
            return {
                x: Board.getTileCenter(x) - Board.pillSize / 2,
                y: Board.getTileCenter(y) - Board.pillSize / 2,
                size: Board.pillSize
            };
        },


        getFruitRect() {
            let pos = Board.fruitPos,
                size = Board.fruitSize / 3;

            return {
                left: pos.x - size,
                right: pos.x + size,
                top: pos.y - size,
                bottom: pos.y + size
            };
        },



        tunnelEnds(x) {
            if (x < tunnelStart) {
                return tunnelEnd;
            }
            if (x > tunnelEnd) {
                return tunnelStart;
            }
            return x;
        },



        inBoard(col, row) {
            return row >= 0 && col >= 0 && row < boardRows && col < boardCols;
        },


        isWall(col, row) {
            return boardMatrix[row][col] === wallValue;
        },

        isIntersection(col, row) {
            return boardMatrix[row][col] === interValue || boardMatrix[row][col] === interPillValue;
        },


        isTunnel(col, row) {
            return boardMatrix[row][col] === tunnelValue;
        },


        hasPill(col, row) {
            return boardMatrix[row][col] === pillPathValue || boardMatrix[row][col] === interPillValue;
        },



        getTurns(pos) {
            return boardTurns[pos] || null;
        },


        tileToString(tile) {
            return "x" + String(tile.x) + "y" + String(tile.y);
        },


        numberToDir(value) {
            switch (value) {
                case 0:
                    return { x: 0, y: -1 }; // Up
                case 1:
                    return { x: -1, y: 0 }; // Left
                case 2:
                    return { x: 0, y: 1 }; // Down
                case 3:
                    return { x: 1, y: 0 }; // Right
            }
        },


        dirToNumber(dir) {
            switch (this.tileToString(dir)) {
                case "x0y-1":
                    return 0; // Up
                case "x-1y0":
                    return 1; // Left
                case "x0y1":
                    return 2; // Down
                case "x1y0":
                    return 3; // Right
            }
        },


        getTileCenter,
        tileToPos
    };
}());