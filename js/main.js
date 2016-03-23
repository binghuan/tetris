// Element to fill into block
// var dot1 = "<span style=\"font-size: 16px; color:black\">*</span>"; // dot 1 is for filled color dot
// var dot0 = "<span style=\"font-size: 16px; color:white\">*</span>"; // dot 1 is for non-filled color dot

var dot1 = "<span class=\"glyphicon glyphicon-asterisk\" aria-hidden=\"true\"></span>"; // dot 1 is for filled color dot
var dot0 = "<span class=\"glyphicon glyphicon-asterisk\" aria-hidden=\"true\" style=\"visibility: hidden\"></span>"; // dot 1 is for filled color

var renderArea = [];
var moveArea = [];
var moveIndex = -1;

function clearAll() {
    for (var i = 0; i < 23; i++) {
        renderArea[i] = [];
        moveArea[i] = [];
        for (var j = 0; j < 23; j++) {
            renderArea[i][j] = 0;
            moveArea[i][j] = 0;
        }
    }
}

function clearMove() {
    for (var x = 0; x < 22; x++) {
        moveArea[x] = [];
        for (var y = 0; y < 22; y++) {
            moveArea[x][y] = 0;
        }
    }
}

function render() {
    var html = "";
    for (var y = 0; y < 23; y++) {

        if (y < 10) {
            if (y < 2) {
                html += "<span style=\"font-size: 12px; color:white\">0" + y + "</span>";
            } else {
                html += "<span style=\"font-size: 12px;\">0" + (y - 2) + "</span>";
            }

            //html += "<span>0" + (y) + "</span>";

        } else {
            //html += "<span> " + y + "</span>";
            if ((y - 2) < 10) {
                html += "<span style=\"font-size: 12px\">0" + (y - 2) + "</span>";
            } else {
                html += "<span style=\"font-size: 12px\">" + (y - 2) + "</span>";
            }
        }

        if (y == 22) {

            for (var x = 0; x < 22; x++) {

                if (x == 0 && x == 1) {
                    html += dot0;
                } else {
                    html += dot1;
                }
            }
            html += "<br/>";
        } else {

            for (var x = 0; x < 22; x++) {
                if (x == 0 || x == 21) {
                    html += dot1;
                } else {
                    if (renderArea[x][y] == 1 || moveArea[x][y] == 1) {
                        //console.log("[", x, y, "] -> draw", renderArea[x][y], moveArea[x][y]);
                        html += dot1;
                    } else {
                        html += dot0;
                    }
                }
            }
            html += "<br/>";
        }
    }
    containner.innerHTML = html;
}

function init() {
    clearAll();
    render();
}

function checkOverlap() {
    for (var x = 1; x < 22; x++) {
        for (var y = 0; y < 22; y++) {
            if (moveArea[x][y] == 1 && renderArea[x][y] == 1) {
                console.log("!!! Overlap");
                return true;
            }
        }
    }

    console.log("!!! No Overlap");
    return false;
}


var inputType = 0;

function getMoveRange(arr) {
    var maxY = -1;
    var maxX = -1;
    var minX = -1;
    var minY = -1;
    for (var y = 21; y >= 0; y--) {
        for (var x = 1; x < 23; x++) {
            if (arr[x][y] == 1) {

                if (minY == -1) {
                    minY = y;
                }
                if (minX == -1) {
                    minX = x;
                }

                if (y > maxY) {
                    maxY = y;
                }
                if (y < minY) {
                    minY = y;
                }
                if (x > maxX) {
                    maxX = x;
                }
                if (x < minX) {
                    minX = x;
                }
            }
        }
    }

    console.log("loc: maxY", maxY, "maxX", maxX);

    return {
        maxX: maxX,
        maxY: maxY,
        minX: minX,
        minY: minY
    };
}

function copyMove() {

    for (var x = 0; x < 22; x++) {
        for (var y = 21; y >= 0; y--) {
            if (moveArea[x][y] == 1) {
                renderArea[x][y] = 1;
                console.log("copy x", x, "y", y, renderArea[x][y]);
            }
        }
    }
}

function clockWise(grid) {
    var newGrid = [];
    var rowLength = Math.sqrt(grid.length);
    newGrid.length = grid.length

    for (var i = 0; i < grid.length; i++) {
        var x = i % rowLength;
        var y = Math.floor(i / rowLength);
        var newX = rowLength - y - 1;
        var newY = x;
        var newPosition = newY * rowLength + newX;
        //console.log(newPosition)
        newGrid[newPosition] = grid[i];
    }
}

// input types
/*
    Type1:
        ****

    Type2:
        *
        *
        **

    Type3:
         *
         *
        **

    Type4:
        *
        **
         *

    Type5:
        **
        **
*/

function isMoveAreaEmpty() {
    // check if moveArea is empty
    var sum = moveArea.reduce(function(a, b) {
        return a.concat(b)
    }).reduce(function(a, b) {
        return a + b
    });

    if (sum == 0) {
        return true;
    } else {
        return false;
    }
}

function checkAvailableLine() {

    var len = renderArea[1].length;

    var hit = false;
    var needToEraseOneLine = false;
    var lineNos = [];
    for (var y = len - 1; y >= 0; y--) {
        var gotLine = true;
        var line = "";
        for (var x = 1; x < 21; x++) {
            if (renderArea[x][y] == 0) {
                line += "X";
            } else {
                line += "O";
            }
        }
        if (line.indexOf("X") == -1) {
            console.log("#", y, line);
            lineNos.push(y);
        }
    }

    for (var i = 0; i < lineNos.length; i++) {
        // Try to erase one line
        len = lineNos[i];
        for (var y = len; y >= 1; y--) {
            for (var x = 1; x < 21; x++) {
                renderArea[x][y] = renderArea[x][y - 1];
            }
        }
    }

    console.log("checkAvailableLine: " + hit);
    return hit;
}

function gameController() {

    console.log("+++ gameController");

    // Check available points
    if (checkAvailableLine()) {
        console.log("=> Get into main control on next round!!")
        return;
    }

    if (isMoveAreaEmpty()) {
        console.log("Generate New input");
        var x = Math.floor((Math.random() * 4) + 1);
        inputType = x;
        //inputType = 1;
        switch (inputType) {
            case 0:
                moveArea[1][0] = 1;
                moveArea[2][0] = 1;
                moveArea[3][0] = 1;
                moveArea[4][0] = 1;
                moveArea[5][0] = 1;
                moveArea[6][0] = 1;
                moveArea[7][0] = 1;
                moveArea[8][0] = 1;
                moveArea[9][0] = 1;
                moveArea[10][0] = 1;
                // moveArea[11][0] = 1;
                // moveArea[12][0] = 1;
                // moveArea[13][0] = 1;
                // moveArea[14][0] = 1;
                // moveArea[15][0] = 1;
                // moveArea[16][0] = 1;
                // moveArea[17][0] = 1;
                // moveArea[18][0] = 1;
                // moveArea[19][0] = 1;
                // moveArea[20][0] = 1;
                break;
            case 1:
                moveArea[8][0] = 1;
                moveArea[9][0] = 1;
                moveArea[10][0] = 1;
                moveArea[11][0] = 1;
                break;
            case 2:
                moveArea[10][2] = 1;
                moveArea[9][0] = 1;
                moveArea[9][1] = 1;
                moveArea[9][2] = 1;
                break;
            case 3:
                // if input type 3
                moveArea[10][0] = 1;
                moveArea[10][1] = 1;
                moveArea[10][2] = 1;
                moveArea[9][2] = 1;
                break;

            case 4:
                // if Input Type4
                moveArea[9][0] = 1;
                moveArea[9][1] = 1;
                moveArea[10][0] = 1;
                moveArea[10][1] = 1;
                break;

            case 5:
                // if Input Type5
                moveArea[9][0] = 1;
                moveArea[10][0] = 1;
                moveArea[10][1] = 1;
                moveArea[11][1] = 1;
                break;
        }

        getMoveRange(moveArea);
        render();
        return;
    }

    // check movement.
    var isOverlap = checkOverlap();
    if (isOverlap == true) {
        clearInterval(gameControllerID);
        alert("Game Over");
        console.log("## Game Over !!!!");
        return;
    }

    var currentY = getMoveRange(moveArea).maxY;
    if (currentY == 21) {
        // move down
        copyMove();
        clearMove();
        inputType = -1;
    }

    // move down
    moveDown();

    if (checkOverlap() == true) {
        moveUp();
        switch (lastAction) {
            case 2:
                moveUp();

                break;
            default:
                break;
        }
        copyMove();
        clearMove();
    } else {
        console.log("!!! NO Overlap");
    }

    getMoveRange(moveArea);
    render();
    console.log("--- gameController");
}

var lastAction = -1;

// Action: 2
function moveDown() {
    lastAction = 2;
    // move down
    for (var x = 0; x < 22; x++) {
        for (var y = 21; y >= 0; y--) {
            moveArea[x][y + 1] = moveArea[x][y];
            moveArea[x][y] = 0;
        }
    }
}

// Action: 3
function moveRight() {
    lastAction = 3;
    // move Right
    for (var y = 0; y < 22; y++) {
        for (var x = 20; x >= 0; x--) {
            console.log();
            moveArea[x + 1][y] = moveArea[x][y];
            moveArea[x][y] = 0;
        }
    }
}

// Action: 1
function moveLeft() {
    lastAction = 1;
    // move down
    for (var y = 0; y < 22; y++) {
        for (var x = 1; x < 22; x++) {
            moveArea[x - 1][y] = moveArea[x][y];
            moveArea[x][y] = 0;
        }
    }
}

// Action: 0
function moveUp() {
    lastAction = 0;
    for (var x = 0; x < 22; x++) {
        for (var y = 1; y < 22; y++) {
            moveArea[x][y - 1] = moveArea[x][y];
            moveArea[x][y] = 0;
        }
    }
}

var containner = null;
var btnDown = null;
var gameControllerID = null;

$(document).keyup(function(e) {
    e.preventDefault(); // prevent the default action (scroll / move caret)

    var keyCode = e.keyCode || e.which,
        arrow = {
            left: 37,
            up: 38,
            right: 39,
            down: 40
        };

    console.log(">> keyup: ", e.which);

    switch (e.which) {
        case 65: // key: a -> left
        case arrow.left:
            if (getMoveRange(moveArea).minX > 1) {
                console.log(">> left: ", e.which);
                moveLeft();
                if (checkOverlap() == true) {
                    console.log("Rollback !!");
                    moveRight();
                }
            };
            break;
        case 68: // key: d -> right
        case arrow.right:

            if (getMoveRange(moveArea).maxX < 20) {
                console.log(">> right: ", e.which);
                moveRight();
                if (checkOverlap() == true) {
                    console.log("Rollback !!");
                    moveLeft();
                }
            };
            break;
        case arrow.up:
            console.log(">> up: ", e.which);
            var backup = moveArea.slice(0);
            clockWise();
            if (checkOverlap() == true) {
                //counterClockwise();
                console.log("Rollback !!");
                moveArea = backup;
            }

            break;
        case arrow.down:
            console.log(">> down: ", e.which);
            gameController();
            break;
        case 83: // key: s
            var backup = moveArea.slice(0);
            clockWise();
            if (checkOverlap() == true) {
                //counterClockwise();
                console.log("Rollback !!");
                moveArea = backup;
            }
            break;
        case 87: // key: w ->
            var backup = moveArea.slice(0);
            counterClockwise();
            if (checkOverlap() == true) {
                //clockWise();
                console.log("Rollback !!");
                moveArea = backup;
            }
            break;

        default:
            return; // exit this handler for other keys
    }
    render();
});

function counterClockwise() {
    var pos1 = getMoveRange(moveArea);
    var newArea = rotate90(moveArea);
    var pos2 = getMoveRange(newArea);
    console.log(pos2, " VS 21, 22, 0");
    if (pos2.maxX < 21 && pos2.maxY < 22 && pos2.minX > 0) {
        console.log("Good to go");
        moveArea = rotate90(moveArea);
    } else {
        console.log("cc Cannnot rotate");
        return;
    }

    var diff = pos2.minY - pos1.minY;
    console.log(">> counter clockWise: diffX", diff);
    correctYmove(diff);
    diff = pos2.minX - pos1.minX;
    console.log(">> counter clockWise: diffY", diff);
    correctXmove(diff);
}

function clockWise() {
    var pos1 = getMoveRange(moveArea);
    var newArea = rotate90(moveArea);
    newArea = rotate90(newArea);
    newArea = rotate90(newArea);
    var pos2 = getMoveRange(newArea);
    if (pos2.maxY < 22 && pos2.maxX < 21 && pos2.minX > 0 && pos2.minY > 0) {
        console.log("Good to go");
        for(var i =0; i< 3; i++) {
            moveArea = rotate90(moveArea);
        }
    } else {
        console.log("c Cannnot rotate");
        return;
    }
    var diff = pos2.minY - pos1.minY;
    console.log(">> clockWise: diffX", diff);
    correctYmove(diff);
    diff = pos2.minX - pos1.minX;
    console.log(">> clockWise: diffY", diff);
    correctXmove(diff);
}

function correctXmove(diff) {
    for (var i = 0; i < Math.abs(diff); i++) {
        if (diff < 0) {
            console.log("--> move down");
            moveRight();
        } else if (diff > 0) {
            console.log("--> move up");
            moveLeft();
        }
    }
}

function correctYmove(diff) {
    for (var i = 0; i < Math.abs(diff); i++) {
        if (diff < 0) {
            console.log("--> move down");
            moveDown();
        } else if (diff > 0) {
            console.log("--> move up");
            moveUp();
        }
    }
}

function rotate90(a) {
    a = Object.keys(a[0]).map(function(c) {
        return a.map(function(r) {
            return r[c];
        });
    });
    // row reverse
    for (i in a) {
        a[i] = a[i].reverse();
    }
    return a;
}

$(document).ready(function() {
    containner = document.getElementById("containner");
    $("#btn_down").click(function() {
        if (gameControllerID) {
            clearInterval(gameControllerID);
            gameControllerID = null;
        }
        gameController();
    });
    $("#btn_pause").click(function() {
        console.log("### PAUSE");
        clearInterval(gameControllerID);
    });
    $("#btn_autorun").click(function() {
        gameControllerID = setInterval(gameController, 100);
    });

    $("#btn_reset").click(function() {
        if (gameControllerID) {
            clearInterval(gameControllerID);
            gameControllerID = null;
        }

        init();
    });

    init();


});
