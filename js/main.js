console.log('running');

let backgroundImage = null;
let raining = false;
let rainTimer = 0;
let rainChance = 0.1;
let rainDuration = 10.0;

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

    let resevoir = new AquaductNode({x: width/2, y: height/2, radius: 25, sink: -1000000, water: 1});
    let temple = new Temple({x: 3/4 * width, y: height/2, radius: 25, health: 100, image: loadImage("./res/building.png")});
    
    addEntity(resevoir);
    addEntity(temple);
    
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

    oldMillis = newMillis;
}

function drawRain() {
    push();
    fill(0, 150, 250, 100);
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

function mouseClicked(e) {

    let anAquaductWasPlacedThisClick = false;
    let anEndNodeWasSetThisClick = false;

    for (let entity of entities) {

        // clickable entities
        if (entity.clickable && entity.collides({x: mouseX, y: mouseY})) {
            entity.onclick(e);
            
            if (entity.aquaductable && !state.placingAquaduct) {
                let aquaductNode = new AquaductNode({x: mouseX, y: mouseY, shouldSpew: true});
                state.placingAquaduct = true;
                selectedAquaduct = new Aquaduct(
                    entity,
                    aquaductNode
                );

                anAquaductWasPlacedThisClick = true;
            }

            if (entity.aquaductable && state.placingAquaduct && selectedAquaduct != null && !anAquaductWasPlacedThisClick && entity != selectedAquaduct.endNode && !anEndNodeWasSetThisClick) {
                console.log('connector !');
                selectedAquaduct.setEndNode(entity);

                if (isDuplicateAquaduct(selectedAquaduct)) {
                    selectedAquaduct.destroy();
                }

                anEndNodeWasSetThisClick = true;
            }
        }
    }

    if (state.placingAquaduct && !anAquaductWasPlacedThisClick) {
        selectedAquaduct = null;
        state.placingAquaduct = false;
    }

    console.log(entities.length);
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
    console.log('keypressed');
    let se = entities.slice();
    shuffle(se);
    for (let e of se) {
        if (e instanceof AquaductNode) {
            e.destroy();
            break;
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
