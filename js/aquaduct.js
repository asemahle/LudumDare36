class Aquaduct {
    constructor(startNode, endNode, settings) {
        settings = settings || {};

        this.drawable = true;

        this.startNode = startNode;
        this.endNode = endNode;
        addEntity(this.startNode);
        addEntity(this.endNode);
        addEntity(this);
        startNode.addAquaduct(this);
        endNode.addAquaduct(this);

        this.flowRate = settings.flowRate || 500;

        this.length = 0;
        this.updateLength();
    }

    updateLength() {
        this.length = new p5.Vector(this.startNode.pos.x - this.endNode.pos.x, this.startNode.pos.y - this.endNode.pos.y).mag();
    }

    setEndNodePosition(point) {
        this.endNode.pos = point;
        this.updateLength();
    }

    setEndNode(node) {
        this.endNode.removeAquaduct(this);
        removeEntity(this.endNode);
        addEntity(node);
        node.addAquaduct(this);
        this.endNode = node;
        this.updateLength();
    }

    draw() {
        push();
        stroke('white');
        strokeWeight(5);

        line(this.startNode.pos.x, this.startNode.pos.y, this.endNode.pos.x, this.endNode.pos.y);
        pop();
    }

    spew() {
        if (this.endNode.aquaducts.length === 1) {
            let dir = new p5.Vector(this.endNode.pos.x - this.startNode.pos.x, this.endNode.pos.y - this.startNode.pos.y).normalize();
            this.endNode.spew(dir);
        }
        if (this.startNode.aquaducts.length === 1) {
            let dir = new p5.Vector(this.startNode.pos.x - this.endNode.pos.x, this.startNode.pos.y - this.endNode.pos.y).normalize();
            this.startNode.spew(dir);
        }
    }

    update(delta) {
        let dWater = (this.flowRate * delta * (this.endNode.water - this.startNode.water))/this.length;
        if (dWater > 0) {
            dWater = Math.min(this.endNode.water, dWater);
            dWater = Math.min(this.startNode.maxWater - this.startNode.water, dWater);
        }
        else if (dWater < 0) {
            dWater = Math.min(this.startNode.water, dWater);
            dWater = Math.min(this.endNode.maxWater - this.endNode.water, dWater);
        }
        this.endNode.water -= dWater;
        this.startNode.water += dWater;
    }
    
    destroy() {
        this.endNode.removeAquaduct(this);
        this.startNode.removeAquaduct(this);
        removeEntity(this);
    }
}
