let MENU_SCREEN = 0;
let HELP_SCREEN = 1;
let GAME_SCREEN = 2;
let GAME_OVER_SCREEN = 3;
let HIGHSCORE_SCREEN = 4;

let mainMenuImage = null;
let helpImage = null;
let gameOverImage = null;

let currentScreen = MENU_SCREEN;

let endGame = false;
let endGameTimer = 0;

let waterProjectileImage = null;
let friendlySoldierImage = null;
let friendlySoldierAttackImage = null;
let friendlySoldierDeathImage = null;
let enemySoldierImage = null;
let enemySoldierAttackImage = null;
let enemySoldierDeathImage = null;
let enemyCavalryImage = null;
let enemyCavalryAttackImage = null;
let enemyCavalryDeathImage = null;
let enemyCatapultImage = null;
let enemyCatapultAttackImage = null;
let enemyCatapultDeathImage = null;
let aquaductTopImage = null;
let aquaductSideImage = null;
let catapultShotImage = null;
let arrowImage = null;
let rubbleImage = null;
let backgroundImage = null;

let raining = null;
let rainTimer = null;
let rainChance = null;
let rainDuration = null;
let stone = null;
let farmEfficiency = null;

let score = 0;

let delta = 0;

let entities = [];
let state = {
    placingAquaduct: false,
};
let selectedAquaduct = null;
let img = null;
let username = '';

let oldMillis = 0;

let highscores = [
    {user: 'LOSER', score: 1},
    {user: 'JIM', score: 2},
    {user: 'JIM', score: 3},
    {user: 'JIM', score: 4},
    {user: 'JIM', score: 5},
    {user: 'JIM', score: 6},
    {user: 'JIM', score: 7},
    {user: 'JIM', score: 8},
    {user: 'JIM', score: 9},
    {user: 'JIM', score: 100},
    {user: 'JIM', score: 101},
    {user: 'JIM', score: 102},
    {user: 'JIM', score: 104},
    {user: 'JIM', score: 103},
    {user: 'WINBOY', score: 105},
    {user: 'JIM', score: 99},
];

function setup() {
    createCanvas(800, 800);
    background(0);

    waterProjectileImage = loadImage("./res/water_projectile.png");

    friendlySoldierImage = loadImage("./res/soldier.png");
    friendlySoldierAttackImage = loadImage("./res/friendly-attack-animation.png");
    friendlySoldierDeathImage = loadImage("./res/soldier_dead.png");
    enemySoldierImage = loadImage("./res/enemy_soldier.png");
    enemySoldierAttackImage = loadImage("./res/attack-animation.png");
    enemySoldierDeathImage = loadImage("./res/enemy_soldier_dead.png");
    enemyCavalryImage = loadImage("./res/cavalry.png");
    enemyCavalryAttackImage = loadImage("./res/cavalry_attack.png");
    enemyCavalryDeathImage = loadImage("./res/cavalry_dead.png");
    enemyCatapultImage = loadImage("./res/catapult.png");
    enemyCatapultAttackImage = loadImage("./res/catapult_attack.png");
    enemyCatapultDeathImage = loadImage("./res/catapult_dead.png");
    backgroundImage = loadImage("./res/grass.png");
    aquaductTopImage = loadImage("./res/aquaduct_top.png");
    aquaductSideImage = loadImage("./res/aquaduct_side.png");
    catapultShotImage = loadImage("./res/catapult_shot.png");
    arrowImage = loadImage("./res/tower_shot.png");
    rubbleImage = loadImage("./res/rubble.png");

    mainMenuImage = loadImage("./res/main_menu.png");
    helpImage = loadImage("./res/help.png");
    gameOverImage = loadImage("./res/game_over.png");
	
    oldMillis = millis();

    $('canvas').on('click contextmenu', (e) => {
        switch (e.which) {
            case 1:
                leftMouseClicked(e);
                break;
            case 3:
                rightMouseClicked(e);
                break;
            default:
                alert('You have a strange Mouse!');
        }
        return false;
    });
}

function initializeGame() {
    highscores.sort((x,y) => { if (x.score < y.score) { return 1;} else { return -1;} });

    endGame = false;

    raining = false;
    rainTimer = 0;
    rainChance = 0.1;
    rainDuration = 10.0;
    stone = 500;
    farmEfficiency = 1.0;

    score = 0;

    entities = [];
    state = { placingAquaduct: false };
    selectedAquaduct = null;
    img = null;

    let reservoir = new ReservoirNode({x: width/2, y: height/2});
    let amphitheatre = new Amphitheatre({x: 1/4*width, y: 1/4*height});
    let tower2 = new Tower({x: 3/4*width, y: 1/4*height});
    let temple = new Temple({x: 3/4 * width, y: height/2});
    let unitFactory = new UnitFactory();
    let barracks = new Barracks({x: 1/2 * width, y: height/4});
    let mine = new Mine({x: 1/4 * width, y: 1/2 * height });
    let farm = new Farm({x: 1/2 * width, y: 3/4 * height });
    let tower1 = new Tower({x: 1/4 * width, y: 3/4 * height });
    let carpenter = new Carpenter({x: 3/4 * width, y: 3/4 * height });
    
    addEntity(reservoir);
    addEntity(amphitheatre);
    addEntity(temple);
    addEntity(unitFactory);
    addEntity(barracks);
    addEntity(mine);
    addEntity(farm);
    addEntity(tower1);
    addEntity(tower2);
    addEntity(carpenter);
}

function finishGame() {
    entities = [];
}

function draw() {
    let newMillis = millis();
    delta = (newMillis - oldMillis) / 1000;
    oldMillis = newMillis;

    if (currentScreen == GAME_SCREEN) {
        drawGame();
    }
    else if (currentScreen == MENU_SCREEN) {
        drawMenu();
    }
    else if (currentScreen == HELP_SCREEN) {
        drawHelp();
    }
    else if (currentScreen == GAME_OVER_SCREEN) {
        drawGameOver();
    } else if (currentScreen == HIGHSCORE_SCREEN) {
        drawHighscoreScreen();
    }
}

function drawHighscoreScreen() {
    background(222);

    textStyle(BOLD);
    text("-- SCORE BOARD --", 300, 80);
    textStyle(NORMAL);

    let highscoresShown = 0;
    let userHigh = false;

    namePos = {x: 100, y: 200};
    scorePos = {x: 300, y: 200};

    let position = 1;
    for (let s of highscores) {
        if (s.score > score || userHigh) {
            text("#" + position + ". " + s.user, namePos.x, namePos.y);
            text(s.score, scorePos.x, scorePos.y);
        } else {
            textStyle(BOLD);
            text("#" + position + ". " + username, namePos.x, namePos.y);
            text(floor(score), scorePos.x, scorePos.y);
            textStyle(NORMAL);
            scorePos.y += 30;
            namePos.y += 30;
            highscoresShown ++;
            position ++;

            if (highscoresShown > 9) break;

            text("#" + position + ". " + s.user, namePos.x, namePos.y);
            text(s.score, scorePos.x, scorePos.y);

            userHigh = true;
        }

        scorePos.y += 30;
        namePos.y += 30;
        highscoresShown ++;
        position ++;
        if (highscoresShown > 9) break;
    }

    scoresToShow = 0;
    namePos = {x: 500, y: 200};
    scorePos = {x: 700, y: 200};

    above = [];
    below = [];
    position = 1;
    for (let s of highscores) {
        if (s.score > score) {
            above.push(s);
            if (above.length > 5) {
                above.shift();
                position ++;
            }
        }

        if (s.score <= score && below.length < 4) {
            below.push(s);
        }
    }

    for (let s of above) {
        text("#" + position + ". " + s.user, namePos.x, namePos.y);
        text(s.score, scorePos.x, scorePos.y);
        scorePos.y += 30;
        namePos.y += 30;
        position ++;
    }
    textStyle(BOLD);
    text("#" + position + ". " + username, namePos.x, namePos.y);
    text(floor(score), scorePos.x, scorePos.y);
    scorePos.y += 30;
    namePos.y += 30;
    textStyle(NORMAL);
    position ++;
    for (let s of below) {
        text("#" + position + ". " + s.user, namePos.x, namePos.y);
        text(s.score, scorePos.x, scorePos.y);
        scorePos.y += 30;
        namePos.y += 30;
        position++;
    }

    textStyle(BOLD);
    text("Press SPACE to PLAY AGAIN", 220, 650);
    textStyle(NORMAL);
}

function drawMenu() {
    image(mainMenuImage, 0, 0);
}

function drawHelp() {
    image(helpImage, 0, 0);
}

function drawGameOver() {
    image(gameOverImage, 0, 0);
    text("Score was: " + floor(score), 50, 50);

    textSize(24);
    text("Name: " + username, 300, 385);
}

function drawGame() {
    background(0);

    // update water physics
    let shuffledEntities = entities.slice();
    shuffledEntities = shuffle(shuffledEntities);
    for (let entity of shuffledEntities) {
        if (entity !== selectedAquaduct) {
            entity.update(delta);
        }
    }
    image(backgroundImage, 0, 0);
    let aquaducts = [];
    let aquaductNodes = [];
    let buildings = [];
    let units = [];
    let others = [];
    for (let entity of entities) {
        if (entity instanceof Unit) {
            units.push(entity);
        } else if (entity instanceof BuildingNode) {
            buildings.push(entity);
        } else if (entity instanceof Aquaduct) {
            entity.spew();
            aquaducts.push(entity);
        } else if (entity instanceof AquaductNode) {
            aquaductNodes.push(entity);
        } else {
            others.push(entity);
        }
    }

    let drawLists = [ aquaducts, aquaductNodes, buildings, units, others ];
    for (let list of drawLists) {
        for (let entity of list) {
            // draw entities
            if (entity.drawable) {
                entity.draw();
            }
        }
    }
    if (raining) {
        drawRain();
        rainTimer -= delta;
        if (rainTimer < 0) {
            raining = false;
        }
    }
    else {
        if (Math.random() < rainChance * delta) {
            raining = true;
            rainTimer = rainDuration;
        }
    }
    drawUI();
    score += delta;
    if (endGame) {
        endGameTimer -= delta;
        if (endGameTimer < 0.0) {
            finishGame();
            getScore();
            currentScreen = GAME_OVER_SCREEN;
        }
    }
}

function drawRain() {
    push();
    fill(0, 150, 250, 80);
    rect(0, 0, width, height);
    stroke(0, 150, 250, 200);
    strokeWeight(4);
    let i = 0;
    for (i = 0; i < 20; ++i) {
        let rainX1 = Math.random() * (width + 100);
        let rainY1 = 0;
        let rainX2 = rainX1 - 100;
        let rainY2 = height;
        let t1 = Math.random();
        let t2 = t1 + 0.05 * Math.random();
        line(
            rainX1 + (rainX2 - rainX1) * t1, rainY1 + (rainY2 - rainY1) * t1,
            rainX1 + (rainX2 - rainX1) * t2, rainY1 + (rainY2 - rainY1) * t2);
    }
    pop();
}

function drawUI() {
    push();
    fill(255, 255, 0);
    var farmBonus = round((farmEfficiency - 1.0) * 100);
    var rainProb = round(rainChance * 100);
    text("Score: " + floor(score), 50, 50);
    text("Stone: " + stone, 50, 100);
    text("Farm bonus: " + farmBonus + "%", 50, 150);
    text ("Chance of rain: " + rainProb + "%", 50, 200);
    pop();
}

function leftMouseClicked(e) {
    if (currentScreen != GAME_SCREEN) {
        return;
    }

    let anAquaductWasPlacedThisClick = false;
    let anEndNodeWasSetThisClick = false;

    for (let entity of entities) {
        // clickable entities
        if (entity.clickable && entity.collides({x: mouseX, y: mouseY})) {
            entity.onclick(e);

            if (entity.aquaductable && !state.placingAquaduct && stone >= 100) {
                let aquaductNode = new AquaductNode({x: mouseX, y: mouseY, shouldSpew: true});
                state.placingAquaduct = true;
                selectedAquaduct = new Aquaduct(
                    entity,
                    aquaductNode
                );

                anAquaductWasPlacedThisClick = true;
            }

            if (entity.aquaductable && state.placingAquaduct && selectedAquaduct != null && !anAquaductWasPlacedThisClick && entity != selectedAquaduct.endNode && !anEndNodeWasSetThisClick) {
                if (selectedAquaduct.startNode !== entity){
                    selectedAquaduct.setEndNode(entity);

                    if (isDuplicateAquaduct(selectedAquaduct)) {
                        selectedAquaduct.destroy();
                        stone += 100;
                    }
                } else {
                    // destroy aquaduct if startNode is connected to end node
                    selectedAquaduct.endNode.destroy();
                    stone += 100;
                }
                anEndNodeWasSetThisClick = true;
            }
        }
    }

    if (state.placingAquaduct && !anAquaductWasPlacedThisClick) {
        selectedAquaduct = null;
        state.placingAquaduct = false;
        stone -= 100;
    }
}

function rightMouseClicked(e) {
    if (currentScreen != GAME_SCREEN) {
        return;
    }

    for (let entity of entities) {
        if (entity instanceof AquaductNode && entity.hovering) {
            for (let aquaduct of entity.aquaducts.slice()) {
                state.placingAquaduct = false;
                aquaduct.destroy();
                stone += 30;
            }
        }
        if (entity.constructor.name == "AquaductNode" && entity.hovering) {
            entity.destroy();
        }
    }
}

function mouseMoved(e) {
    for (let entity of entities) {
        if (state.placingAquaduct && selectedAquaduct) {
            selectedAquaduct.setEndNodePosition({x: mouseX, y: mouseY});
        }
        
        // hoverable entities
        if (entity.hoverable) {
            if (entity.collides({x: mouseX, y: mouseY})) {
                entity.hovering = true;
                entity.onhover(e);
            } else {
                entity.hovering = false;
            }
        }
    }
}

function keyPressed(){
    if (currentScreen == MENU_SCREEN && key == ' ') {
        currentScreen = HELP_SCREEN;
    }
    else if (currentScreen == HELP_SCREEN && key == ' ') {
        initializeGame();
        currentScreen = GAME_SCREEN;
    }
    else if (currentScreen == HIGHSCORE_SCREEN && key == ' ') {
        initializeGame();
        currentScreen = GAME_SCREEN;
    }

    // GAME OVER STUFF
    if (key == 'q' || key == 'Q') {
        currentScreen = GAME_OVER_SCREEN;
        getScore();
        return;
    }
    if (currentScreen != GAME_OVER_SCREEN) {
        return;
    }

    if (/[a-zA-Z0-9-_ ]/.test(key)) {
        if (username.length < 8) {
            username += key;
        }
    }
}

function keyReleased() {
    if (currentScreen != GAME_OVER_SCREEN) return;
    if (keyCode == 13) {
        // ENTER
        postScore();
        if (username.length == 0) {
            username = 'NONAME';
        }
        currentScreen = HIGHSCORE_SCREEN;
    } else if (keyCode == 8) {
        if (username.length > 0) {
            username = username.slice(0, username.length - 1);
        }
    }
}

function addEntity(o) {
    if (!entityAlreadyAdded(o)) {
        entities.push(o);
    }
}

function entityAlreadyAdded(o) {
    return !(entities.indexOf(o) === -1);
}

function removeEntity(o) {
    let index = entities.indexOf(o);
    if (index >= 0) {
        entities.splice(entities.indexOf(o), 1);
    }
}

function isDuplicateAquaduct(aquaduct) {
    numDupes = 0;
    for (let entity of entities) {
        if (entity instanceof Aquaduct) {
            if ((entity.endNode == aquaduct.endNode && entity.startNode == aquaduct.startNode) || (entity.startNode == aquaduct.endNode && entity.endNode == aquaduct.startNode)) {
                numDupes++;
                if (numDupes >= 2) {
                    return true;
                }
            }
        }
    }
    return false;
}

function shuffle(a) {
    let j, x, i;
    for (i = a.length; i != 0; --i) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }

    return a;
}

function getScore() {
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://aqueduct-tycoon.firebaseio.com/.json?auth=zz9yZ5dPm9f1y4oHud1DBhIFDi4P0JFkSSHgnoic",
        "method": "GET",
        "headers": {
            "cache-control": "no-cache"
        }
    };

    $.ajax(settings).done((response) => {
        highscores = [];
        for(let o in response) {
            if(response[o].name != null && response[o].score != null && $.isNumeric(response[o].score)) {
                highscores.push({
                    user: response[o].name,
                    score: response[o].score
                });
            }
        }
        highscores.sort((x,y) => { if (x.score < y.score) { return 1;} else { return -1;} });
    });
}

function postScore() {
    var settings = {
        async: true,
        crossDomain: true,
        url: "https://aqueduct-tycoon.firebaseio.com/.json?auth=zz9yZ5dPm9f1y4oHud1DBhIFDi4P0JFkSSHgnoic",
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        processData: false,
        data: JSON.stringify({"name": username, "score": floor(score)})
    };
    $.ajax(settings).done(function (response) { });
}
