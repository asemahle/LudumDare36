console.log('running');

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
    
    let resevoir = new AquaductNode({x: width/2, y: height/2, radius: 25, sink: -100000, water: 0});
    entities.push(resevoir);

    img = loadImage("assets/imgres.jpg");

    oldMillis = millis();
}

function draw() {
    background(0);
    let newMillis = millis();
    // push();
    // shearY(PI/4.0);
    // image(img, 0, 0);
    // pop();

    let shuffledEntities = entities.slice();
    shuffle(shuffledEntities);
    for (let entity of shuffledEntities) {
        entity.update((newMillis - oldMillis)/1000);
    }

    for (let entity of entities) {

        // draw entities
        if (entity.drawable) {
            entity.draw();
        }
    }

    oldMillis = newMillis;
}

function mouseClicked(e) {

    let anAquaductWasPlacedThisClick = false;
    let anEndNodeWasSetThisClick = false;

    for (let entity of entities) {

        // clickable entities
        if (entity.clickable && entity.collides({x: mouseX, y: mouseY})) {
            entity.onclick(e);
            
            if (entity.aquaductable && !state.placingAquaduct) {
                let aquaductNode = new AquaductNode({x: mouseX, y: mouseY});
                state.placingAquaduct = true;
                selectedAquaduct = new Aquaduct(
                    entity,
                    aquaductNode
                );
                entities.push(aquaductNode);
                entities.push(selectedAquaduct);

                anAquaductWasPlacedThisClick = true;
            }

            if (entity.aquaductable && state.placingAquaduct && selectedAquaduct != null && !anAquaductWasPlacedThisClick && entity != selectedAquaduct.endNode && !anEndNodeWasSetThisClick) {
                console.log('connector !');
                entities.splice(entities.indexOf(selectedAquaduct.endNode), 1);
                selectedAquaduct.endNode = entity;

                anEndNodeWasSetThisClick = true;
            }
        }
    }

    if (state.placingAquaduct && !anAquaductWasPlacedThisClick) {
        selectedAquaduct = null;
        state.placingAquaduct = false;
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