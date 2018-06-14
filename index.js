//This variable will store the vortex sprite
var vortex;
// This variable will add vortex to a collison group
var vortexgroup;
//  This blank array is a placeholder for the enemies or shapes
var enemies = new Array(20);
// Collison group for enemies
var enGroup;
//Initial space between enemies so that they flow in one by one
var spacing = 50;
// Starting speed of enemies
var enemySpeed = 1;
// When this counter reaches 20, it will trigger a new wave of enemies
var waveCounter = 0;
// Initial lives
var lives = 3;
// Initial score
var score = 0;
// X and Y position of the vortex
var holeX;
var holeY;

var gameOver = false;
var gameStarted;
//For drag

var startX;
var startY;
var endX;
var endY;

var afterColor = 'red';
var lastDrawn = "";
var isDrawInProgress;
var showAfterimage;

function mousePressed() {
    if (!gameStarted) {
        gameStarted = true;
        start();
    } else if (gameOver) {
        location.reload();
    } else {
        showAfterimage = false;
        startX = mouseX;
        startY = mouseY;
        endX = mouseX;
        endY = mouseY;
    }
}

function mouseDragged() {
    if (gameStarted && !gameOver) {
        endX = mouseX;
        endY = mouseY;
        isDrawInProgress = true;
    }
}

function mouseReleased() {
    endX = mouseX;
    endY = mouseY;

    if (isDrawInProgress) {
        afterColor = 'red';

        lastDrawn = detectLineType();
        checkForMatches();
        isDrawInProgress = false;
        showAfterimage = true;
    }
    setTimeout(function() {
        if (!isDrawInProgress) {
            showAfterimage = false;
        }
    }, 1000);
}

function detectLineType() {
    var midX = (startX + endX) / 2;
    var midY = (startY + endY) / 2;
    if (endX > midX - 10 && endX <= midX + 10) {

        return "vertical";
    } else if (endY > midY - 10 && endY <= midY + 10) {
        return "horizontal";
    } else if (midY < startY) {
        if (endX < midX - 10)
            return "decreasing";
        else if (endX > midX + 10)
            return "increasing";

    } else if (midY > startY) {

        if (endX > midX + 10)
            return "decreasing";
        else if (endX < midX - 10)
            return "increasing";
    }

}

function checkForMatches() {
    for (x = 0; x < enemies.length; x++) {
        if (enemies[x].en.position.x > 0 && enemies[x].en.position.x < window.innerWidth && enemies[x].en.position.y > 0 && enemies[x].en.position.y < window.innerHeight) {
            if (enemies[x].typeOfLine == lastDrawn) {
                afterColor = 'green';

                enemies[x].en.setSpeed(0, 0);

                enemies[x].reposition();

                enemies[x].pickLineType();
                waveCounter++;
                if (waveCounter == enemies.length) {
                    enemySpeed += 1;
                }
                score++;
            }

        }
    }
    //lastDrawn="blank";
}

function Enemy() {
    this.setPosition = function() {
        var rand = Math.random();
        if (rand < .25) {
            initX = -50 - spacing;
            initY = random(window.innerHeight);
        } else if (rand < .50) {
            initX = window.innerWidth + 50 + spacing;
            initY = random(window.innerHeight);
        } else if (rand < .75) {
            initY = window.innerHeight + 50 + spacing;
            initX = random(window.innerWidth);
        } else {
            initY = -50 - spacing;
            initX = random(window.innerWidth);
        }
    }
    this.reposition = function() {
        this.setPosition();
        en.position = createVector(initX, initY);
        en.attractionPoint(enemySpeed, holeX, holeY);

    };
    this.setPosition();
    var en = createSprite(initX, initY, width / 2, height / 2);

    this.en = en;
    var lineS;
    enGroup.add(en);

    this.pickLineType = function() {
        var typeOfLine;
        rand = Math.random();

        if (rand < .25) {
            typeOfLine = "vertical";


        } else if (rand < .5) {
            typeOfLine = "horizontal";

        } else if (rand < .75) {
            typeOfLine = "decreasing";

        } else {
            typeOfLine = "increasing";


        }
        this.typeOfLine = typeOfLine;
    };
    this.pickLineType();

}

function loseLife(x) {
    // SpriteB.setSpeed(0,0);
    //SpriteA.remove();
    enemies[x].en.setSpeed(0, 0);
    enemies[x].reposition();
    enemies[x].pickLineType();
    waveCounter++;
    if (waveCounter == enemies.length) {
        enemySpeed += 1;
    }
    lives--;
    if (lives == 0) {
        gameOver = true;
    }
}

function preload() {
    enGroup = new Group();
    vortexgroup = new Group();
}

// Any set-up logic that should run before the draw loop goes here
function setup() {
    if (window.innerWidth > 800 && window.innerHeight > 600) {
        enemySpeed = 3;
    }
    holeX = window.innerWidth / 2;
    holeY = window.innerHeight / 2;

    for (x = 0; x < enemies.length; x++) {
        enemies[x] = new Enemy();
        spacing += 50;
        //enemies[x].en.setCollider("rectangle",0,0,50,50);

    }

    createCanvas(window.innerWidth, window.innerHeight);
    fill(51);
    vortex = createSprite(holeX, holeY, 100, 100);
    vortex.draw = function() {
        ellipse(0, 0, vortex.width, vortex.height);
        vortex.setCollider("circle", 0, 0, vortex.width / 2);
        vortexgroup.add(vortex);
    }
    drawSprites();
}

function start() {
    for (x = 0; x < enemies.length; x++) {
        enemies[x].en.attractionPoint(enemySpeed, holeX, holeY);


    }
}


function draw() {
    if (!gameOver && gameStarted) {
        background(255);
        textSize(50);
        textAlign(CENTER);
        text(score, window.innerWidth / 2, 60)
        textSize(25);

        text("Lives: " + lives, 50, 30);

        if (isDrawInProgress) {
            strokeWeight(5);
            stroke('blue');
            line(startX, startY, endX, endY);
        }
        if (showAfterimage) {
            strokeWeight(5);
            stroke(afterColor);
            line(startX, startY, endX, endY);

        }

        drawSprites();
        for (x = 0; x < enemies.length; x++) {
            if (enemies[x].en.position.x > vortex.position.x - 45 && enemies[x].en.position.x < vortex.position.x + 45 && enemies[x].en.position.y > vortex.position.y - 45 && enemies[x].en.position.y < vortex.position.y + 45) {
                loseLife(x);
            }
            var sprite = enemies[x].en;
            //console.log(enemies[x].en);
            var enVector = sprite.position;
            strokeWeight(5);
            stroke('black');
            if (enemies[x].typeOfLine == "vertical") {
                line(enVector.x, enVector.y - 30, enVector.x, enVector.y - 60);
            } else if (enemies[x].typeOfLine == "horizontal") {
                line(enVector.x - 20, enVector.y - 40, enVector.x + 20, enVector.y - 40);

            } else if (enemies[x].typeOfLine == "increasing") {
                line(enVector.x - 20, enVector.y - 30, enVector.x + 20, enVector.y - 60);

            } else if (enemies[x].typeOfLine == "decreasing") {
                line(enVector.x + 20, enVector.y - 30, enVector.x - 20, enVector.y - 60);
            }
        }
    } else if (gameOver) {
        background(255)
        textAlign(CENTER);
        textSize(25);
        text("Game Over, Your Score: " + score + "\n Click or Tap anywhere to restart ", window.innerWidth / 2, window.innerHeight / 2);
    } else if (!gameStarted) {
        textAlign(CENTER);
        textSize(15);
        text("Draw lines corresponding to the lines\n above each square to prevent them\n from reaching the void\n\n Click and drag anywhere to draw\n On mobile use touch! ", window.innerWidth / 2, 80);
        textSize(25);
        text("Click or Tap anywhere to start!", window.innerWidth / 2, (window.innerHeight / 2) + 150);
    }
}