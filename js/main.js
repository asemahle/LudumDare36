let MENU_SCREEN = 0;
let HELP_SCREEN = 1;
let GAME_SCREEN = 2;
let GAME_OVER_SCREEN = 3;

let mainMenuImage = null;
let helpImage = null;
let gameOverImage = null;

let currentScreen = MENU_SCREEN;

let endGame = false;
let endGameTimer = 0;

let aquaductTopImage = null;
let aquaductSideImage = null;
let catapultShotImage = null;
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

let oldMillis = 0;
function setup() {
    createCanvas(800, 800);
    background(0);

    backgroundImage = loadImage("./res/grass.png");
    aquaductTopImage = loadImage("./res/aquaduct_top.png");
    aquaductSideImage = loadImage("./res/aquaduct_side.png");
    catapultShotImage = loadImage("./res/catapult_shot.png");
    rubbleImage = loadImage("./res/rubble.png");

    mainMenuImage = loadImage("./res/main_menu.png");
    helpImage = loadImage("./res/help.png");
    gameOverImage = loadImage("./res/game_over.png");
	
    oldMillis = millis();
}

function initializeGame() {

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
    let amphitheatre = new Amphitheatre({x: 3/4*width, y: 1/4*height});
    let temple = new Temple({x: 3/4 * width, y: height/2});
    let unitFactory = new UnitFactory();
    let barracks = new Barracks({x: 1/2 * width, y: height/4});
    let mine = new Mine({x: 1/4 * width, y: 1/2 * height });
    let farm = new Farm({x: 1/2 * width, y: 3/4 * height });
    let tower = new Tower({x: 1/4 * width, y: 3/4 * height });
    let carpenter = new Carpenter({x: 3/4 * width, y: 3/4 * height });
    
    addEntity(reservoir);
    addEntity(amphitheatre);
    addEntity(temple);
    addEntity(unitFactory);
    addEntity(barracks);
    addEntity(mine);
    addEntity(farm);
    addEntity(tower);
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
    }
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
}

function drawGame() {
    background(0);

    // update water physics
    let shuffledEntities = entities.slice();
    shuffle(shuffledEntities);
    for (let entity of shuffledEntities) {
        if (entity !== selectedAquaduct) {
            entity.update(delta);
        }
    }
    image(backgroundImage, 0, 0);
    for (let entity of entities) {
        // spew water from aquaduct ends
        if (entity instanceof Aquaduct) {
            entity.spew();
        }
        // draw entities
        if (entity.drawable) {
            entity.draw();
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

function mouseClicked(e) {
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
    else if (currentScreen == GAME_OVER_SCREEN && key == ' ') {
        initializeGame();
        currentScreen = GAME_SCREEN;
    }
    else if (currentScreen == GAME_SCREEN && keyCode == DELETE) {
        for (let entity of entities) {
            if (entity instanceof AquaductNode && entity.hovering) {
                for (let aquaduct of entity.aquaducts.slice()) {
                    aquaduct.destroy();
                    stone += 30;
                }
            }
            if (entity.constructor.name == "AquaductNode" && entity.hovering) {
                entity.destroy();
            }
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

