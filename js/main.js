console.log('running');

let entities = [];
let state = {
    placingAquaduct: false,
};
let selectedAquaduct = null;
let img = null;


function setup() {
    createCanvas(800, 800);
    background(0);
    
    let resevoir = new Resevoir({x: width/2, y: height/2})
    entities.push(resevoir);

    img = loadImage("assets/imgres.jpg");
}

function draw() {
    background(0);
    // push();
    // shearY(PI/4.0);
    // image(img, 0, 0);
    // pop();
    for (let entity of entities) {

        // draw entities
        if (entity.drawable) {
            entity.draw();
        }
    }
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