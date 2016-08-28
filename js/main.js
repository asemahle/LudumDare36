console.log('running');

let backgroundImage = null;
let raining = false;
let rainTimer = 0;
let rainChance = 0.1;
let rainDuration = 10.0;
let barracksThreshold = 20;
let stone = 500;
let farmEfficiency = 1.0;

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

    let reservoir = new ReservoirNode({x: width/2, y: height/2});
    let temple = new Temple({x: 3/4 * width, y: height/2, radius: 32, health: 100, image: loadImage("./res/building.png")});
    let unitFactory = new UnitFactory();
    let barracks = new Barracks({x: 1/2 * width, y: height/4, radius: 32, health: 100, image: loadImage("./res/barracks.png")});
    let mine = new Mine({x: 1/4 * width, y: 1/2 * height });
    let farm = new Farm({x: 1/2 * width, y: 3/4 * height });
    let tower = new Tower({x: 1/4 * width, y: 3/4 * height });
    
    addEntity(reservoir);
    addEntity(temple);
    addEntity(unitFactory);
    addEntity(barracks);
    addEntity(mine);
    addEntity(farm);
    addEntity(tower);
    
    oldMillis = millis();
}

function draw() {
    background(0);
    let newMillis = millis();
    let delta = (newMillis - oldMillis) / 1000;

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

    oldMillis = newMillis;
}

function drawRain() {
    push();
    //fill(0, 150, 250, 100);
    //rect(0, 0, width, height);
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
    text("Stone: " + stone, 50, 50);
    text("Farm bonus: " + farmBonus + "%", 50, 100);
    text ("Chance of rain: " + rainProb + "%", 50, 150);
    pop();
}

function mouseClicked(e) {

    let anAquaductWasPlacedThisClick = false;
    let anEndNodeWasSetThisClick = false;

    for (let entity of entities) {
        // clickable entities
        if (entity.clickable && entity.collides({x: mouseX, y: mouseY})) {
            entity.onclick(e);
            
            if (entity.aquaductable && !state.placingAquaduct && stone > 100) {
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
    if (keyCode == DELETE) {
        for (let entity of entities) {
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

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
        
    }

    return array;
}
