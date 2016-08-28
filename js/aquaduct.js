class Aquaduct {
    constructor(startNode, endNode, settings) {
        settings = settings || {};

        this.drawable = true;

        this.startNode = startNode;
        this.endNode = endNode;
        addEntity(this.startNode);
        addEntity(this.endNode);
        startNode.addAquaduct(this);
        endNode.addAquaduct(this);

        this.flowRate = settings.flowRate || 5;
    }

    setEndNodePosition(point) {
        this.endNode.pos = point;
    }

    setEndNode(node) {
        removeEntity(this.endNode);
        addEntity(node);
        this.endNode = node;
    }

    draw() {
        push();
        stroke('white');
        strokeWeight(5);

        this.startNode.draw();
        this.endNode.draw();

        line(this.startNode.pos.x, this.startNode.pos.y, this.endNode.pos.x, this.endNode.pos.y);
        pop();
    }

    spew() {
        // TODO - Must spew water somehow???
    }

    update(delta) {
        let dWater = this.flowRate * delta * (this.endNode.water - this.startNode.water);
        this.endNode.water -= dWater;
        this.startNode.water += dWater;
    }
    
    destroy() {
        removeEntity(this);
    }
}