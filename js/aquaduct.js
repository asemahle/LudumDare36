class Aquaduct {
    constructor(startNode, endNode, settings) {
        settings = settings || {};

        this.drawable = true;

        this.startNode = startNode;
        this.endNode = endNode;

        this.flowRate = settings.flowRate || 1;
    }

    setEndNodePosition(point) {
        this.endNode.pos = point;
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

    update(delta) {
        let dWater = this.flowRate * delta * (this.endNode.water - this.startNode.water);
        this.endNode.water -= dWater;
        this.startNode.water += dWater;
    }
}